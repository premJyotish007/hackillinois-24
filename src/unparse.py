import ast
import json
import astor
import sys
from pprint import pprint

seen_functions = set()

def create_function_def(method):
    global seen_functions
    seen_functions.add(method["name"])
    args_list = [ast.arg(arg=arg, annotation=None) for arg in method["arguments"]]
    arguments = ast.arguments(
        args=args_list,
        posonlyargs=[],
        vararg=None,
        kwonlyargs=[],
        kw_defaults=[],
        kwarg=None,
        defaults=[]
    )
    return ast.FunctionDef(name=method["name"], args=arguments,returns=None, body=[ast.Pass()], decorator_list=[])

def create_class_def(cls):

    body = [create_function_def(method) for method in cls["methods"]]
    return ast.ClassDef(name=cls["name"], bases=[ast.Name(id=json_data_2[idx]["name"]) for idx in cls["Parent_class"]], keywords=[], body=body, decorator_list=[])

def json_to_ast(json_data, functions):
    # Create a module
    module = ast.Module(body=[])
    
    for cls in json_data:
        # Create a class definition
        class_def = create_class_def(cls)
        # Add the class definition to the module
        module.body.append(class_def)
    for func in functions:
        # Create a function definition
        if func["name"] in seen_functions:
            continue
        function_def = create_function_def(func)
        # Add the function definition to the module
        module.body.append(function_def)
    return module


def convert_to_json(classes, functions):
    json_classes = []
    for cls in classes:
        json_classes.append({
            "name": cls["name"],
            "methods": [func for func in functions if func["class"] == cls["name"]],
            "Parent_class": []
        })
    
    for cls in classes:
        parent_name = cls["parent"]
        parent_idx = None
        child_idx = None
        for idx, json_cls in enumerate(json_classes):
            if json_cls["name"] == parent_name:
                parent_idx = idx
            if json_cls["name"] == cls["name"]:
                child_idx = idx
        if parent_idx is not None and child_idx is not None:
            json_classes[child_idx]["Parent_class"].append(parent_idx)
    
    for idx, json_cls in enumerate(json_classes):
         # add self to the arguments of the member functions
            for method in json_cls["methods"]:
                method["arguments"].insert(0, "self")
                

    # pprint(json_classes)
    return json_classes

# json_data_2 = [
#     {
#             "name": "parentClass",
#             "methods": [
#                 {
#                     "name": "parentMethod",
#                     "args": ["self"]
#                 },
#                 {
#                     "name": "parentMethod2",
#                     "args": ["self", "arg1"]
#                 }   
#             ],
#             "Parent_class" : []
#     },
#     {
#             "name": "MyClass",
#             "methods": [
#                 {
#                     "name": "MyMethod",
#                     "args": ["self"]
#                 },
#                 {
#                     "name": "MyMethod2",
#                     "args": ["self", "arg1"]
#                 }
#             ],
#             "Parent_class" : [0]
#     }
# ]

# classes = [
#     {
#         "name": "MyClass",
#         "parent": "parentClass"
#     },
#     {
#         "name": "parentClass",
#         "parent": ""
#     }
# ]

# functions = [
#     {
#         "name": "parentMethod",
#         "args": [],
#         "class": "parentClass",
#         "member": True,
#         "body": "pass"
#     },
#     {
#         "name": "parentMethod2",
#         "args": ["arg1"],
#         "class": "parentClass",
#         "member": True,
#         "body": "pass"
#     },
#     {
#         "name": "MyMethod",
#         "args": ["arg1"],
#         "class": "",
#         "member": False,
#         "body": "pass"
#     },
#     {
#         "name": "MyMethod2",
#         "args": ["arg1"],
#         "class": "MyClass",
#         "member": True,
#         "body": "pass"
#     }
# ]
if __name__ == "__main__":
    file_name = sys.argv[1]
    with open(file_name, "r") as file:
        data = json.loads(file.read())
    classes, functions = data["classes"], data["functions"]
    json_data_2 = convert_to_json(classes, functions)
    # pprint(json_data_2)

    # Convert JSON data to AST
    module_ast = json_to_ast(json_data_2, functions)

    # Print the AST
    print(astor.to_source(module_ast))