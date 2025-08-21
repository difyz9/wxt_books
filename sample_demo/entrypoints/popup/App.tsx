import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-w-96 p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex justify-center space-x-4 mb-6">
        <a href="https://wxt.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={wxtLogo} className="w-16 h-16" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={reactLogo} className="w-16 h-16 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Bilibili 字幕下载器
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">📖 使用说明</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">1.</span>
              打开任意 Bilibili 视频页面
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">2.</span>
              点击页面右侧的"📥 下载字幕"按钮
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">3.</span>
              选择需要的字幕格式进行下载
            </li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">🎯 支持格式</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">📄 SRT 格式</div>
            <div className="bg-gray-50 p-2 rounded">📄 VTT 格式</div>
            <div className="bg-gray-50 p-2 rounded">📝 纯文本</div>
            <div className="bg-gray-50 p-2 rounded">🕒 文本+时间</div>
            <div className="bg-gray-50 p-2 rounded">📋 原始 JSON</div>
          </div>
        </div>
        
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
        >
          点击测试 {count}
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          基于 WXT + React + TypeScript + Tailwind CSS
        </p>
      </div>
      
      <div className="text-center">
        <a 
          href="https://www.bilibili.com" 
          target="_blank" 
          className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <span className="mr-2">🎬</span>
          打开 Bilibili
        </a>
      </div>
    </div>
  );
}

export default App;
