n=152
s=0
temp=n
while temp>0:
    d=temp%10
    s+=d**3
    temp//=10
if n==s:
    print("pal")
else:
    print("not pal")
