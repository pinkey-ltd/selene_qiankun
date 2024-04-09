export const transTreeData = (data: any[], idStr: string, pidStr: string, childrenStr: string) => {
  const res = [],
    hash: any = {}
  let i = 0,
    j = 0
  const len = data.length
  for (; i < len; i++) {
    hash[data[i][idStr]] = data[i]
  }
  for (; j < len; j++) {
    const dataVal = data[j],
      hashVP = hash[dataVal[pidStr]]
    if (hashVP) {
      !hashVP[childrenStr] && (hashVP[childrenStr] = [])
      hashVP[childrenStr].push(dataVal)
    } else {
      res.push(dataVal)
    }
  }
  return res
}
