# function_args.py 파일
print('Hello, python3!!!\n')

# function_args.py 파일
import sys
def getName(name, age):
    print (name + " : " + age)
if __name__ == '__main__':
    getName(sys.argv[1], sys.argv[2])


