import ast
from pprint import pprint
import json
import sys

'''
classes: [{name: className, parent: parentClass}]
functions: [{name: functionName, arguments: functionArguments, class: functionClass, member: isMemberFunction}, body: bodyText]
'''

def convert_ast_to_json(tree):
    to_return_classes = []
    to_return_functions = []
    seen_functions = set()

    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            to_return_classes.append({
                "name": node.name,
                "parent": node.bases[0].id if node.bases else ""
            })
            for child in node.body:
                if isinstance(child, ast.FunctionDef):
                    to_return_functions.append({
                        "name": child.name,
                        "arguments": [arg.arg for arg in child.args.args],
                        "class": node.name,
                        "member": True,
                        "body": ast.unparse(child.body)
                    })
                    seen_functions.add(child.name)
        elif isinstance(node, ast.FunctionDef) and node.name not in seen_functions:
            to_return_functions.append({
                "name": node.name,
                "arguments": [arg.arg for arg in node.args.args],
                "class": "",
                "member": False,
                "body": ast.unparse(node.body)
            })
            seen_functions.add(node.name)
            
    return to_return_classes, to_return_functions
    

if __name__ == "__main__":
    # get code variable as an input argument to the program 
    file_name = sys.argv[1]
    with open(file_name, "r") as file:
        data = file.read()
        ast_tree = ast.parse(data)

        to_dump1, to_dump2 = convert_ast_to_json(ast_tree)

        for class_ in to_dump1:
            class_["functions"] = [func for func in to_dump2 if func["class"] == class_["name"]]
        print(json.dumps({'classes': to_dump1, 'functions': to_dump2}, indent=4))

