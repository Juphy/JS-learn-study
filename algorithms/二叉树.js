// 二叉树的中序遍历
function inorderTraversal1(root) {
  let res = [];
  let inorder = (root) => {
    if (!root) {
      return;
    }
    inorder(root.left);
    res.push(root.value);
    inorder(root.right);
  }
  return res;
}

function inorderTraversal2(root) {
  let res = [], stk = [];
  while (root || stk.length) {
    while (root) {
      stk.push(root);
      root = root.left;
    }
    root = stk.pop(); //最左边
    res.push(root.value);
    root = root.right; // 右移
  }
  return res;
}

function maxDepth(root) {
  if (!root) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}
console.log(maxDepth([[3, 9, 20, null, null, 15, 7]]));