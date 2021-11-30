a = ['aa','b','c','a a','c','aa'] #JavaScript

def find_index(data, target):
  res = []
  lis = data
  while True:
    try:
      res.append(lis.index(target) + (res[-1]+1 if len(res)!=0 else 0))
      lis = data[res[-1]+1:]
    except:
      break
  return res


print(find_index(a,'aa'))
      #이전 index의 다음칸부터 다음 인덱스값 찾음
      #최소값은 0의 한칸 전 -1
      #+1해줘야 새로운 인덱스 값
