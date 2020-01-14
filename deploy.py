import os
import oss2
import re
from string import Template

cdn = "https://cdn.yunlizhihui.com/$project_name/$branch_name/$file_name"
oss_url = "https://yunli-fe.oss-cn-beijing.aliyuncs.com/$project_name/$branch_name/$file_name"
cdn_template = Template(cdn)
oss_template = Template(oss_url)

project_name = os.environ['ENV_PROJECT_NAME']
branch_name = os.environ['ENV_BRANCH_NAME']
version_number = os.environ['ENV_VERSION_NUMBER']
current_dir = os.path.split(os.path.realpath(__file__))[0]

print("project name: ", project_name)
print("branch name: ", branch_name)
print("version_number: ", version_number)
print("current_dir: ", current_dir)

auth = oss2.Auth('LTAIevFqzdruQ4OP', 'PyxXdPuFQdJZ4Zy9CJe3RasBvW4y1q')
bucket = oss2.Bucket(auth, 'oss-cn-beijing.aliyuncs.com', 'yunli-fe')

# 删除 OSS 上已经存在的文件
prefix = branch_name
exist_file = oss2.ObjectIterator(bucket, prefix)
for obj in exist_file:
    if obj.is_prefix():  # 文件夹
        print('directory not delete: ' + obj.key)
    else:  # 文件
        print('delete file: ' + obj.key)

file_list = [];
remote_list = [];


def file_name(file_dir):
    print("file_dir: " + file_dir)
    for root, dirs, files in os.walk(file_dir):
        print(root)  # 当前目录路径
        print(files)  # 当前路径下所有非目录子文件
        sub_file_list = []
        remote_file_list = []
        for i in range(0, len(files)):
            remote_file_list.append(project_name + "/" + branch_name + "/" + version_number + "/" + files[i])
            sub_file_list.append(root + "/" + files[i])
        remote_list.extend(remote_file_list)
        file_list.extend(sub_file_list)


file_name(current_dir + '/build')

for i in range(0, len(file_list)):
    item = file_list[i]
    remote_item = remote_list[i]
    item_name_split = item.split('/')
    last_name = item_name_split[-1]
    object_name = '/'.join(item_name_split)
    bucket.put_object_from_file(remote_item, item)
    print('#################', remote_item,'  %%%  ', item)
    print("cdn url: ", cdn_template.substitute({'project_name': project_name, "branch_name": branch_name, "version_number": version_number, "file_name": last_name}))
    print("OSS Source: ", oss_template.substitute({'project_name': project_name, "branch_name": branch_name, "version_number": version_number, "file_name": last_name}))

print(branch_name + ' upload success!')