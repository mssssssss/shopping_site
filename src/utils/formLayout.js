function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// 表单样式
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

// 注册表单的样式
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 8,
    },
    sm: {
      span: 24,
      offset: 8,
    },
  },
};
export { getItem, formItemLayout,tailFormItemLayout };
