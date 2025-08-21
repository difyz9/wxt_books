# Tailwind CSS 样式系统

## Tailwind CSS 在 WXT 扩展开发中的应用

Tailwind CSS 的原子化设计理念为扩展开发提供了高效、一致的样式解决方案。本章将深入探讨如何在 WXT 项目中充分利用 Tailwind CSS 构建现代化的用户界面。

## 原子化 CSS 设计理念

### 1. 原子化 CSS 核心概念
```html
<!-- 传统 CSS 方式 -->
<div class="card">
  <h2 class="card-title">标题</h2>
  <p class="card-content">内容</p>
  <button class="card-button">按钮</button>
</div>

<!-- Tailwind CSS 原子化方式 -->
<div class="bg-white rounded-lg shadow-md p-6 space-y-4">
  <h2 class="text-xl font-semibold text-gray-900">标题</h2>
  <p class="text-gray-600 leading-relaxed">内容</p>
  <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
    按钮
  </button>
</div>
```

### 2. 优势分析
```typescript
// 优势对比
const advantages = {
  开发速度: '无需编写自定义 CSS，直接在 HTML 中应用样式',
  一致性: '设计系统内置，确保视觉一致性',
  维护性: '样式与组件绑定，易于修改和重构',
  性能: '只包含使用的样式，减少 CSS 包体积',
  响应式: '内置响应式断点，易于实现移动端适配'
};
```

## Tailwind CSS 基础应用

### 1. 核心工具类
```html
<!-- 布局 -->
<div class="flex items-center justify-between">
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-1">内容</div>
  </div>
</div>

<!-- 间距 -->
<div class="m-4 p-6 mx-auto my-8">
  <div class="space-y-2 space-x-4">内容</div>
</div>

<!-- 尺寸 -->
<div class="w-full h-screen max-w-md min-h-0">
  <img class="w-32 h-32 object-cover" src="image.jpg" />
</div>

<!-- 颜色 -->
<div class="bg-gray-100 text-gray-900 border-gray-300">
  <span class="text-blue-500 bg-blue-50">蓝色文本</span>
</div>

<!-- 字体 -->
<h1 class="text-2xl font-bold leading-tight tracking-wide">
  标题
</h1>
<p class="text-sm font-normal leading-relaxed">
  段落文本
</p>
```

### 2. 响应式设计
```html
<!-- 响应式布局 -->
<div class="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4
">
  <div class="
    p-4 
    text-sm 
    md:text-base 
    lg:text-lg
  ">
    响应式内容
  </div>
</div>

<!-- 响应式显示/隐藏 -->
<nav class="
  hidden 
  md:flex 
  md:items-center 
  md:space-x-4
">
  桌面端导航
</nav>

<button class="
  md:hidden 
  p-2 
  rounded-md
">
  移动端菜单按钮
</button>
```

### 3. 状态变体
```html
<!-- 悬停和焦点状态 -->
<button class="
  bg-blue-500 
  hover:bg-blue-600 
  focus:bg-blue-700 
  focus:outline-none 
  focus:ring-2 
  focus:ring-blue-500 
  focus:ring-offset-2
  active:bg-blue-800
  disabled:bg-gray-300
  disabled:cursor-not-allowed
">
  交互按钮
</button>

<!-- 组合状态 -->
<input class="
  border 
  border-gray-300 
  focus:border-blue-500 
  focus:ring-1 
  focus:ring-blue-500 
  invalid:border-red-500 
  invalid:ring-red-500
" />
```

## 扩展 UI 组件设计

### 1. 按钮组件系统
```typescript
// Button 组件变体
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick
}) => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-md',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ];

  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700',
      'focus:ring-blue-500'
    ],
    secondary: [
      'bg-gray-100',
      'text-gray-900',
      'hover:bg-gray-200',
      'focus:ring-gray-500'
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'hover:bg-red-700',
      'focus:ring-red-500'
    ],
    ghost: [
      'bg-transparent',
      'text-gray-700',
      'hover:bg-gray-100',
      'focus:ring-gray-500'
    ]
  };

  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-sm'],
    lg: ['px-6', 'py-3', 'text-base']
  };

  const widthClasses = fullWidth ? ['w-full'] : [];

  const allClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
    ...widthClasses
  ].join(' ');

  return (
    <button
      className={allClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
```

### 2. 卡片组件
```typescript
interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  border = false,
  hover = false
}) => {
  const baseClasses = ['bg-white'];
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };
  
  const borderClasses = border ? 'border border-gray-200' : '';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  const className = [
    ...baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    borderClasses,
    hoverClasses
  ].filter(Boolean).join(' ');
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// 使用示例
const TabCard = ({ tab }: { tab: chrome.tabs.Tab }) => (
  <Card hover padding="md" shadow="sm">
    <div className="flex items-center space-x-3">
      {tab.favIconUrl && (
        <img 
          src={tab.favIconUrl} 
          alt="" 
          className="w-4 h-4 flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {tab.title}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {tab.url}
        </p>
      </div>
    </div>
  </Card>
);
```

### 3. 表单组件
```typescript
// Input 组件
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseInputClasses = [
    'block',
    'w-full',
    'rounded-md',
    'border-gray-300',
    'shadow-sm',
    'focus:border-blue-500',
    'focus:ring-blue-500',
    'sm:text-sm'
  ];
  
  const errorClasses = error 
    ? ['border-red-300', 'focus:border-red-500', 'focus:ring-red-500']
    : [];
    
  const iconPadding = {
    left: leftIcon ? 'pl-10' : '',
    right: rightIcon ? 'pr-10' : ''
  };
  
  const inputClasses = [
    ...baseInputClasses,
    ...errorClasses,
    iconPadding.left,
    iconPadding.right,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        <input
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="h-5 w-5 text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Switch 组件
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <button
          type="button"
          className={`
            relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent 
            rounded-full cursor-pointer transition-colors ease-in-out duration-200 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${checked ? 'bg-blue-600' : 'bg-gray-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !disabled && onChange(!checked)}
          disabled={disabled}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white 
              shadow transform ring-0 transition ease-in-out duration-200
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-gray-900">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
```

## 主题定制和配置

### 1. Tailwind 配置文件
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./entrypoints/**/*.{html,js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 自定义颜色
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      
      // 自定义字体
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      
      // 自定义圆角
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      
      // 自定义阴影
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'extension': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      
      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  darkMode: 'class',
};
```

### 2. 暗黑模式支持
```typescript
// 暗黑模式 Hook
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (stored) {
      setIsDark(stored === 'true');
    } else {
      setIsDark(systemPreference);
    }
  }, []);
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);
  
  return { isDark, setIsDark };
};

// 支持暗黑模式的组件
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark, setIsDark } = useDarkMode();
  
  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold">我的扩展</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDark ? '🌞' : '🌙'}
        </button>
      </div>
      {children}
    </div>
  );
};
```

### 3. 自定义 CSS 变量
```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: 59 130 246; /* blue-500 */
    --color-secondary: 107 114 128; /* gray-500 */
    --color-success: 16 185 129; /* emerald-500 */
    --color-warning: 245 158 11; /* amber-500 */
    --color-error: 239 68 68; /* red-500 */
    
    --border-radius: 0.5rem;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .dark {
    --color-primary: 96 165 250; /* blue-400 */
    --color-secondary: 156 163 175; /* gray-400 */
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
  }
  
  .input {
    @apply block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: rgb(156 163 175) transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgb(156 163 175);
    border-radius: 3px;
  }
}
```

## 响应式设计实现

### 1. 扩展专用断点
```javascript
// tailwind.config.js 中的自定义断点
module.exports = {
  theme: {
    screens: {
      'xs': '320px',    // 极小屏幕
      'sm': '375px',    // 小屏手机
      'md': '768px',    // 平板
      'lg': '1024px',   // 桌面
      'xl': '1280px',   // 大桌面
      'popup': '400px', // 扩展弹窗
    },
  },
};
```

### 2. 弹性布局系统
```typescript
const ExtensionLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部导航 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img className="h-8 w-8" src="/icon.png" alt="Extension" />
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                我的扩展
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                标签页
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                书签
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                设置
              </a>
            </nav>
          </div>
        </div>
      </header>
      
      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                快速操作
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  关闭重复标签页
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  整理书签
                </button>
              </div>
            </div>
          </aside>
          
          {/* 主内容 */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
```

### 3. 移动端优化
```typescript
const MobileOptimizedComponent: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      {/* 移动端标题栏 */}
      <div className="flex items-center justify-between mb-6 sm:hidden">
        <h1 className="text-xl font-bold">标签管理</h1>
        <button className="p-2 rounded-md bg-gray-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
      </div>
      
      {/* 搜索栏 - 移动端全宽 */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="搜索标签页..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* 标签页列表 - 响应式网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  标签页标题 {index + 1}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-1">
                  https://example.com/page/{index + 1}
                </p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100 transition-colors">
                切换
              </button>
              <button className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-md hover:bg-red-100 transition-colors">
                关闭
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 性能优化

### 1. CSS 包体积优化
```javascript
// tailwind.config.js
module.exports = {
  // 只包含使用的样式
  content: [
    "./entrypoints/**/*.{html,js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  
  // 移除未使用的样式
  safelist: [
    // 动态生成的类名
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    {
      pattern: /bg-(red|green|blue)-(100|500|900)/,
      variants: ['hover', 'focus'],
    },
  ],
  
  // 自定义 PurgeCSS 配置
  purge: {
    options: {
      // 保留特定的类名
      safelist: ['animate-pulse', 'animate-spin'],
    },
  },
};
```

### 2. 组件样式复用
```typescript
// 创建样式常量
export const styles = {
  button: {
    base: 'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    },
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    },
  },
  
  card: {
    base: 'bg-white rounded-lg shadow',
    variants: {
      default: 'p-6',
      compact: 'p-4',
      large: 'p-8',
    },
  },
  
  text: {
    heading: {
      h1: 'text-3xl font-bold text-gray-900',
      h2: 'text-2xl font-semibold text-gray-900',
      h3: 'text-lg font-medium text-gray-900',
    },
    body: {
      default: 'text-sm text-gray-700',
      muted: 'text-sm text-gray-500',
      small: 'text-xs text-gray-500',
    },
  },
};

// 样式组合工具
export const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

// 使用示例
const MyButton: React.FC<{
  variant: keyof typeof styles.button.variants;
  size: keyof typeof styles.button.sizes;
  children: React.ReactNode;
}> = ({ variant, size, children }) => {
  return (
    <button
      className={cn(
        styles.button.base,
        styles.button.variants[variant],
        styles.button.sizes[size]
      )}
    >
      {children}
    </button>
  );
};
```

### 3. 动态样式生成
```typescript
// 动态主题生成器
const generateThemeClasses = (primaryColor: string) => {
  const colors = {
    50: `${primaryColor}-50`,
    100: `${primaryColor}-100`,
    500: `${primaryColor}-500`,
    600: `${primaryColor}-600`,
    700: `${primaryColor}-700`,
  };
  
  return {
    button: `bg-${colors[500]} hover:bg-${colors[600]} text-white`,
    link: `text-${colors[600]} hover:text-${colors[700]}`,
    background: `bg-${colors[50]}`,
  };
};

// 条件样式生成
const getStatusClasses = (status: 'success' | 'warning' | 'error') => {
  const statusMap = {
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };
  
  return `px-3 py-1 rounded-full border text-sm font-medium ${statusMap[status]}`;
};
```

## 实践练习

### 练习 1: 扩展设置界面
设计一个完整的设置界面：
- [ ] 使用卡片布局组织设置项
- [ ] 实现暗黑模式切换
- [ ] 添加表单验证样式
- [ ] 支持移动端响应式

### 练习 2: 标签页管理器
构建标签页管理界面：
- [ ] 网格布局显示标签页
- [ ] 悬停效果和动画
- [ ] 搜索和过滤功能样式
- [ ] 批量操作界面

### 练习 3: 通知系统
开发通知组件系统：
- [ ] 不同类型的通知样式
- [ ] 动画进入和退出效果
- [ ] 自动消失和手动关闭
- [ ] 堆叠显示效果

## 调试和工具

### 1. 开发工具
```bash
# Tailwind CSS 智能提示
npm install -D @tailwindcss/intellisense

# 样式检查
npm install -D stylelint stylelint-config-tailwindcss

# 类名排序
npm install -D prettier prettier-plugin-tailwindcss
```

### 2. 浏览器调试
```javascript
// 在浏览器控制台中调试 Tailwind 类名
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'T') {
    const element = document.elementFromPoint(e.clientX, e.clientY);
    console.log('Element classes:', element?.className);
    console.log('Computed styles:', getComputedStyle(element));
  }
});
```

## 总结

通过本章学习，你应该掌握：

✅ **Tailwind CSS 核心概念**
- 原子化 CSS 设计理念
- 工具类的系统性使用
- 响应式设计方法

✅ **扩展 UI 开发实践**
- 组件库设计和实现
- 主题系统和暗黑模式
- 移动端优化策略

✅ **性能优化技巧**
- CSS 包体积控制
- 样式复用和组织
- 动态样式生成

✅ **开发效率提升**
- 配置和工具使用
- 调试和维护方法
- 最佳实践应用

至此，你已经掌握了现代 Web 扩展开发的核心技术栈。下一阶段我们将学习如何将这些技术整合到 WXT 框架中，开发完整的扩展项目。
