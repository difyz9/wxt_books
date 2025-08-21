# React 基础应用

## React 在 WXT 扩展开发中的应用

React 为 WXT 扩展开发提供了强大的组件化能力，让我们能够构建复杂而高效的用户界面。本章将深入探讨如何在扩展开发中最大化 React 的优势。

## React 核心概念回顾

### 1. 组件化思想
```typescript
// 函数组件 - 现代 React 的主要形式
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;
```

### 2. JSX 语法进阶
```typescript
// 条件渲染
const ExtensionStatus = ({ isEnabled }: { isEnabled: boolean }) => (
  <div>
    {isEnabled ? (
      <span className="text-green-500">扩展已启用</span>
    ) : (
      <span className="text-red-500">扩展已禁用</span>
    )}
  </div>
);

// 列表渲染
const TabList = ({ tabs }: { tabs: chrome.tabs.Tab[] }) => (
  <ul>
    {tabs.map(tab => (
      <li key={tab.id} className="tab-item">
        <img src={tab.favIconUrl} alt="" />
        <span>{tab.title}</span>
      </li>
    ))}
  </ul>
);

// Fragment 使用
const Header = () => (
  <>
    <h1>扩展标题</h1>
    <p>扩展描述</p>
  </>
);
```

## React Hooks 深入应用

### 1. useState - 状态管理
```typescript
import React, { useState } from 'react';

// 基础状态管理
const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
};

// 复杂状态管理
interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSync: boolean;
}

const SettingsPanel = () => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    notifications: true,
    autoSync: false
  });
  
  const updateSetting = <K extends keyof UserSettings>(
    key: K, 
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div>
      <select 
        value={settings.theme}
        onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark')}
      >
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
      
      <label>
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={(e) => updateSetting('notifications', e.target.checked)}
        />
        启用通知
      </label>
    </div>
  );
};
```

### 2. useEffect - 副作用处理
```typescript
import React, { useState, useEffect } from 'react';

// Chrome API 调用
const CurrentTab = () => {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getCurrentTab = async () => {
      try {
        const [tab] = await chrome.tabs.query({ 
          active: true, 
          currentWindow: true 
        });
        setCurrentTab(tab);
      } catch (error) {
        console.error('获取当前标签页失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getCurrentTab();
  }, []);
  
  if (loading) return <div>加载中...</div>;
  if (!currentTab) return <div>未找到当前标签页</div>;
  
  return (
    <div>
      <h3>{currentTab.title}</h3>
      <p>{currentTab.url}</p>
    </div>
  );
};

// 事件监听器
const TabUpdates = () => {
  const [updates, setUpdates] = useState<string[]>([]);
  
  useEffect(() => {
    const handleTabUpdate = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (changeInfo.status === 'complete') {
        setUpdates(prev => [...prev, `标签页 ${tabId} 加载完成`]);
      }
    };
    
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    
    // 清理函数
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
    };
  }, []);
  
  return (
    <ul>
      {updates.map((update, index) => (
        <li key={index}>{update}</li>
      ))}
    </ul>
  );
};

// 定时器和清理
const AutoSave = ({ data }: { data: any }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      chrome.storage.local.set({ autoSavedData: data });
    }, 30000); // 每30秒自动保存
    
    return () => clearInterval(interval);
  }, [data]);
  
  return null;
};
```

### 3. useContext - 全局状态管理
```typescript
import React, { createContext, useContext, useReducer } from 'react';

// 定义应用状态
interface AppState {
  user: User | null;
  settings: UserSettings;
  permissions: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

// 定义 Action 类型
type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_PERMISSIONS'; payload: string[] };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload }
      };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    default:
      return state;
  }
};

// Context 创建
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider 组件
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    settings: {
      theme: 'light',
      notifications: true,
      autoSync: false
    },
    permissions: []
  });
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook for using context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// 使用示例
const UserProfile = () => {
  const { state, dispatch } = useApp();
  
  const loginUser = async () => {
    // 模拟登录
    const user = await fetchUserData();
    dispatch({ type: 'SET_USER', payload: user });
  };
  
  return (
    <div>
      {state.user ? (
        <div>
          <h2>欢迎, {state.user.name}!</h2>
          <p>{state.user.email}</p>
        </div>
      ) : (
        <button onClick={loginUser}>登录</button>
      )}
    </div>
  );
};
```

### 4. 自定义 Hooks
```typescript
// Chrome Storage Hook
import { useState, useEffect } from 'react';

export const useChromeStorage = <T>(
  key: string, 
  defaultValue: T
): [T, (value: T) => void, boolean] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadValue = async () => {
      try {
        const result = await chrome.storage.local.get([key]);
        setValue(result[key] ?? defaultValue);
      } catch (error) {
        console.error('Failed to load from storage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadValue();
  }, [key, defaultValue]);
  
  const updateValue = async (newValue: T) => {
    try {
      await chrome.storage.local.set({ [key]: newValue });
      setValue(newValue);
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  };
  
  return [value, updateValue, loading];
};

// 使用示例
const Settings = () => {
  const [settings, setSettings, loading] = useChromeStorage('userSettings', {
    theme: 'light',
    notifications: true
  });
  
  if (loading) return <div>加载设置...</div>;
  
  return (
    <div>
      <button 
        onClick={() => setSettings({ 
          ...settings, 
          theme: settings.theme === 'light' ? 'dark' : 'light' 
        })}
      >
        切换主题
      </button>
    </div>
  );
};

// Chrome Tabs Hook
export const useChromeTabs = () => {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTabs = async () => {
      try {
        const allTabs = await chrome.tabs.query({});
        setTabs(allTabs);
      } catch (error) {
        console.error('Failed to load tabs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const handleTabUpdate = () => {
      loadTabs();
    };
    
    loadTabs();
    chrome.tabs.onCreated.addListener(handleTabUpdate);
    chrome.tabs.onRemoved.addListener(handleTabUpdate);
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    
    return () => {
      chrome.tabs.onCreated.removeListener(handleTabUpdate);
      chrome.tabs.onRemoved.removeListener(handleTabUpdate);
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
    };
  }, []);
  
  const closeTab = async (tabId: number) => {
    try {
      await chrome.tabs.remove(tabId);
    } catch (error) {
      console.error('Failed to close tab:', error);
    }
  };
  
  const switchToTab = async (tabId: number) => {
    try {
      await chrome.tabs.update(tabId, { active: true });
    } catch (error) {
      console.error('Failed to switch tab:', error);
    }
  };
  
  return { tabs, loading, closeTab, switchToTab };
};

// Permissions Hook
export const usePermissions = (permissions: string[]) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result = await chrome.permissions.contains({
          permissions
        });
        setHasPermissions(result);
      } catch (error) {
        console.error('Failed to check permissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermissions();
  }, [permissions]);
  
  const requestPermissions = async () => {
    try {
      const granted = await chrome.permissions.request({
        permissions
      });
      setHasPermissions(granted);
      return granted;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    }
  };
  
  return { hasPermissions, loading, requestPermissions };
};
```

## 组件设计模式

### 1. 容器组件与展示组件
```typescript
// 展示组件 - 纯 UI，无业务逻辑
interface TabItemProps {
  tab: chrome.tabs.Tab;
  onClose: (tabId: number) => void;
  onSelect: (tabId: number) => void;
  isActive?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ 
  tab, 
  onClose, 
  onSelect, 
  isActive = false 
}) => (
  <div 
    className={`tab-item ${isActive ? 'active' : ''}`}
    onClick={() => onSelect(tab.id!)}
  >
    <img src={tab.favIconUrl} alt="" />
    <span className="tab-title">{tab.title}</span>
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onClose(tab.id!);
      }}
      className="close-btn"
    >
      ×
    </button>
  </div>
);

// 容器组件 - 业务逻辑处理
const TabManager: React.FC = () => {
  const { tabs, loading, closeTab, switchToTab } = useChromeTabs();
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  
  const handleTabSelect = (tabId: number) => {
    setActiveTabId(tabId);
    switchToTab(tabId);
  };
  
  if (loading) return <TabListSkeleton />;
  
  return (
    <div className="tab-manager">
      {tabs.map(tab => (
        <TabItem
          key={tab.id}
          tab={tab}
          onClose={closeTab}
          onSelect={handleTabSelect}
          isActive={tab.id === activeTabId}
        />
      ))}
    </div>
  );
};
```

### 2. 高阶组件 (HOC)
```typescript
// 权限检查 HOC
const withPermissions = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: string[]
) => {
  return (props: P) => {
    const { hasPermissions, loading, requestPermissions } = usePermissions(requiredPermissions);
    
    if (loading) {
      return <div>检查权限中...</div>;
    }
    
    if (!hasPermissions) {
      return (
        <div className="permission-required">
          <p>此功能需要额外权限</p>
          <button onClick={requestPermissions}>
            授权
          </button>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// 使用示例
const TabsManagerWithPermissions = withPermissions(
  TabManager, 
  ['tabs']
);

// 错误边界 HOC
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return class extends React.Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Extension error:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return (
          <div className="error-fallback">
            <h2>出现错误</h2>
            <p>{this.state.error?.message}</p>
            <button onClick={() => this.setState({ hasError: false })}>
              重试
            </button>
          </div>
        );
      }
      
      return <Component {...this.props} />;
    }
  };
};
```

### 3. Render Props 模式
```typescript
// 数据获取组件
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => React.ReactNode;
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [url]);
  
  return <>{children({ data, loading, error, refetch: fetchData })}</>;
};

// 使用示例
const UserList = () => (
  <DataFetcher<User[]> url="/api/users">
    {({ data, loading, error, refetch }) => {
      if (loading) return <div>加载中...</div>;
      if (error) return <div>错误: {error}</div>;
      if (!data) return <div>无数据</div>;
      
      return (
        <div>
          <button onClick={refetch}>刷新</button>
          <ul>
            {data.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      );
    }}
  </DataFetcher>
);
```

## 状态管理最佳实践

### 1. 本地状态 vs 全局状态
```typescript
// 本地状态 - 组件内部使用
const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // 本地状态逻辑...
};

// 全局状态 - 跨组件共享
const { state, dispatch } = useApp();
```

### 2. 状态更新模式
```typescript
// 不可变更新
const updateUser = (userId: string, updates: Partial<User>) => {
  setUsers(prevUsers => 
    prevUsers.map(user => 
      user.id === userId 
        ? { ...user, ...updates }
        : user
    )
  );
};

// 使用 immer 简化复杂更新
import { produce } from 'immer';

const updateNestedState = (updates: any) => {
  setState(produce(draft => {
    draft.user.profile.settings.theme = updates.theme;
    draft.user.profile.settings.notifications = updates.notifications;
  }));
};
```

### 3. 异步状态管理
```typescript
// 通用异步状态 Hook
const useAsync = <T>(asyncFn: () => Promise<T>, deps: any[] = []) => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    let cancelled = false;
    
    const runAsync = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const data = await asyncFn();
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    };
    
    runAsync();
    
    return () => {
      cancelled = true;
    };
  }, deps);
  
  return state;
};

// 使用示例
const BookmarksList = () => {
  const { data: bookmarks, loading, error } = useAsync(
    () => chrome.bookmarks.getTree(),
    []
  );
  
  if (loading) return <div>加载书签...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <ul>
      {bookmarks?.map(bookmark => (
        <li key={bookmark.id}>{bookmark.title}</li>
      ))}
    </ul>
  );
};
```

## 性能优化

### 1. React.memo 和 useMemo
```typescript
// 组件记忆化
const TabItem = React.memo<TabItemProps>(({ tab, onClose, onSelect }) => {
  return (
    <div onClick={() => onSelect(tab.id!)}>
      <span>{tab.title}</span>
      <button onClick={(e) => {
        e.stopPropagation();
        onClose(tab.id!);
      }}>×</button>
    </div>
  );
});

// 值记忆化
const FilteredTabs = ({ tabs, filter }: { tabs: Tab[]; filter: string }) => {
  const filteredTabs = useMemo(() => 
    tabs.filter(tab => 
      tab.title?.toLowerCase().includes(filter.toLowerCase())
    ),
    [tabs, filter]
  );
  
  return (
    <div>
      {filteredTabs.map(tab => (
        <TabItem key={tab.id} tab={tab} />
      ))}
    </div>
  );
};
```

### 2. useCallback 优化
```typescript
const TabManager = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [selectedTabs, setSelectedTabs] = useState<Set<number>>(new Set());
  
  // 避免子组件重复渲染
  const handleTabSelect = useCallback((tabId: number) => {
    setSelectedTabs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tabId)) {
        newSet.delete(tabId);
      } else {
        newSet.add(tabId);
      }
      return newSet;
    });
  }, []);
  
  const handleTabClose = useCallback((tabId: number) => {
    chrome.tabs.remove(tabId);
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
  }, []);
  
  return (
    <div>
      {tabs.map(tab => (
        <TabItem
          key={tab.id}
          tab={tab}
          onSelect={handleTabSelect}
          onClose={handleTabClose}
          isSelected={selectedTabs.has(tab.id!)}
        />
      ))}
    </div>
  );
};
```

## 实践练习

### 练习 1: 标签页管理器
创建一个完整的标签页管理组件：
- [ ] 显示所有打开的标签页
- [ ] 支持关闭标签页
- [ ] 支持切换到指定标签页
- [ ] 支持搜索过滤
- [ ] 支持批量操作

### 练习 2: 设置面板
构建一个用户设置界面：
- [ ] 主题切换功能
- [ ] 通知开关
- [ ] 数据同步设置
- [ ] 权限管理
- [ ] 数据导入导出

### 练习 3: 书签管理器
开发书签管理功能：
- [ ] 树形结构显示
- [ ] 添加/编辑/删除书签
- [ ] 文件夹管理
- [ ] 搜索功能
- [ ] 拖拽排序

## 常见问题

### Q: 如何在扩展中处理异步操作？
```typescript
// 使用 async/await 和错误处理
const handleAsyncOperation = async () => {
  try {
    setLoading(true);
    const result = await chrome.tabs.query({ active: true });
    setData(result);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Q: 如何避免内存泄漏？
```typescript
useEffect(() => {
  const listener = (tabId: number) => {
    // 处理逻辑
  };
  
  chrome.tabs.onRemoved.addListener(listener);
  
  // 必须清理监听器
  return () => {
    chrome.tabs.onRemoved.removeListener(listener);
  };
}, []);
```

### Q: 如何处理扩展权限？
```typescript
const PermissionGuard = ({ children, permissions }: {
  children: React.ReactNode;
  permissions: string[];
}) => {
  const { hasPermissions, requestPermissions } = usePermissions(permissions);
  
  if (!hasPermissions) {
    return (
      <button onClick={requestPermissions}>
        请求权限
      </button>
    );
  }
  
  return <>{children}</>;
};
```

## 总结

通过本章学习，你应该掌握：

✅ **React 核心概念在扩展开发中的应用**
- 组件化设计思想
- 现代 Hooks 的使用
- 状态管理最佳实践

✅ **扩展特定的 React 开发模式**
- Chrome API 的集成
- 权限管理组件
- 错误边界处理

✅ **性能优化技巧**
- 组件记忆化
- 回调函数优化
- 异步操作处理

✅ **实际项目开发能力**
- 可复用组件设计
- 复杂交互实现
- 代码组织和架构

下一章我们将学习 TypeScript，为你的 React 代码添加类型安全保障。
