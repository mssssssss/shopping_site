// 错误边界组件
// 在可能发生错误的组件外层包裹错误边界组件
import React from "react";
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    console.log("@@@", error);
    return { hasError: true };
  }

  //   在后代组件抛出错误后被调用
  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
