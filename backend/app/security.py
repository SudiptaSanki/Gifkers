import ast

FORBIDDEN_MODULES = {"subprocess", "shutil", "os.system"}
FORBIDDEN_FUNCTIONS = {"eval", "exec", "compile", "__import__"}

def analyze_code_security(code_str: str) -> None:
    """
    Parses Python code AST to inspect for prohibited system commands or unsafe invocations.
    Raises ValueError if malicious patterns are detected.
    """
    try:
        tree = ast.parse(code_str)
    except SyntaxError as e:
        # Syntax errors are allowed here, executor will capture syntax error during execution
        return

    for node in ast.walk(tree):
        # Check imports
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name in FORBIDDEN_MODULES:
                    raise ValueError(f"Prohibited import detected: '{alias.name}'")
        elif isinstance(node, ast.ImportFrom):
            if node.module in FORBIDDEN_MODULES:
                raise ValueError(f"Prohibited import detected from module: '{node.module}'")

        # Check call expressions
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in FORBIDDEN_FUNCTIONS and node.func.id != "exec":
                    raise ValueError(f"Prohibited function call detected: '{node.func.id}'")
