export default defineContentScript({
  matches: ['*://www.bilibili.com/video/*', '*://www.bilibili.com/list/*'],
  main() {
    console.log('🎉 简洁版 Bilibili 扩展已加载')

    // 创建简单按钮
    const createSimpleButton = (): void => {
      // 检查按钮是否已存在
      if (document.getElementById('simple-bilibili-button')) {
        return
      }

      const button = document.createElement('div')
      button.id = 'simple-bilibili-button'
      button.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          background: #00aeec;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Microsoft YaHei', sans-serif;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 174, 236, 0.3);
          transition: all 0.3s ease;
          user-select: none;
        ">
          🎵 简单按钮
        </div>
      `
      
      // 添加悬停效果
      const buttonElement = button.firstElementChild as HTMLElement
      button.addEventListener('mouseenter', () => {
        buttonElement.style.transform = 'translateY(-2px)'
        buttonElement.style.boxShadow = '0 6px 16px rgba(0, 174, 236, 0.4)'
      })
      
      button.addEventListener('mouseleave', () => {
        buttonElement.style.transform = 'translateY(0)'
        buttonElement.style.boxShadow = '0 4px 12px rgba(0, 174, 236, 0.3)'
      })

      // 点击事件
      button.addEventListener('click', () => {
        alert('🎉 按钮被点击了！')
        console.log('🎵 简单按钮点击事件触发')
      })

      // 添加到页面
      document.body.appendChild(button)
      console.log('✅ 简单按钮已创建')
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createSimpleButton)
    } else {
      createSimpleButton()
    }

    console.log('🎵 简洁版 Bilibili 扩展初始化完成')
  }
})
