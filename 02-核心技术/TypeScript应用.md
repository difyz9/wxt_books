# TypeScript 应用

## TypeScript 在 WXT 扩展开发中的价值

TypeScript 为 WXT 扩展开发带来了类型安全、更好的开发体验和更强的代码可维护性。本章将深入探讨如何在扩展开发中充分利用 TypeScript 的强大功能。

## TypeScript 基础回顾

### 1. 基本类型系统
```typescript
// 基础类型
let extensionName: string = 'My Extension';
let isEnabled: boolean = true;
let version: number = 1.0;
let permissions: string[] = ['activeTab', 'storage'];

// 对象类型
interface ExtensionConfig {
  name: string;
  version: string;
  permissions: string[];
  optional_permissions?: string[];
}

// 函数类型
type MessageHandler = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => boolean | void;

// 联合类型
type Theme = 'light' | 'dark' | 'auto';
type StorageArea = 'local' | 'sync' | 'session';

// 泛型
interface StorageData<T> {
  key: string;
  value: T;
  timestamp: number;
}
```

### 2. 接口和类型别名
```typescript
// 扩展相关接口
interface Tab extends chrome.tabs.Tab {
  // 扩展 Chrome 原生类型
  customData?: {
    lastVisited: number;
    userNotes: string;
    category: string;
  };
}

interface UserSettings {
  theme: Theme;
  notifications: {
    enabled: boolean;
    types: NotificationType[];
  };
  privacy: {
    trackingProtection: boolean;
    blockAds: boolean;
  };
}

// 消息传递类型
interface MessageBase {
  id: string;
  timestamp: number;
}

interface GetTabsMessage extends MessageBase {
  type: 'GET_TABS';
  filters?: {
    url?: string;
    title?: string;
  };
}

interface UpdateSettingsMessage extends MessageBase {
  type: 'UPDATE_SETTINGS';
  settings: Partial<UserSettings>;
}

type ExtensionMessage = GetTabsMessage | UpdateSettingsMessage;

// 响应类型
interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 3. 高级类型操作
```typescript
// 映射类型
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type ReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 工具类型
type SettingsKeys = keyof UserSettings;
type SettingsValues = UserSettings[SettingsKeys];
type RequiredSettings = Required<UserSettings>;
type PartialSettings = Partial<UserSettings>;

// 模板字面量类型
type EventType = 'tab' | 'window' | 'bookmark';
type ActionType = 'create' | 'update' | 'remove';
type EventName = `${EventType}_${ActionType}`;
// 结果: 'tab_create' | 'tab_update' | 'tab_remove' | ...
```

## Chrome API 类型定义

### 1. 扩展 Chrome 类型
```typescript
// 扩展 Tab 类型
declare global {
  namespace chrome.tabs {
    interface Tab {
      // 添加自定义属性
      _customId?: string;
      _lastAccessed?: number;
      _userData?: {
        notes: string;
        tags: string[];
        rating: number;
      };
    }
  }
}

// 创建更严格的类型
interface StrictTab {
  id: number; // 确保 id 不为 undefined
  url: string; // 确保 url 不为 undefined
  title: string; // 确保 title 不为 undefined
  favIconUrl?: string;
  active: boolean;
  pinned: boolean;
  index: number;
  windowId: number;
}

// 类型守卫
const isValidTab = (tab: chrome.tabs.Tab): tab is StrictTab => {
  return (
    typeof tab.id === 'number' &&
    typeof tab.url === 'string' &&
    typeof tab.title === 'string'
  );
};

// 使用示例
const getValidTabs = async (): Promise<StrictTab[]> => {
  const tabs = await chrome.tabs.query({});
  return tabs.filter(isValidTab);
};
```

### 2. 存储 API 类型安全
```typescript
// 定义存储数据结构
interface StorageSchema {
  userSettings: UserSettings;
  tabHistory: TabHistoryItem[];
  bookmarkFolders: BookmarkFolder[];
  extensionState: ExtensionState;
}

// 类型安全的存储操作
class TypedStorage {
  // 读取数据
  static async get<K extends keyof StorageSchema>(
    key: K
  ): Promise<StorageSchema[K] | undefined> {
    const result = await chrome.storage.local.get([key]);
    return result[key];
  }
  
  // 设置数据
  static async set<K extends keyof StorageSchema>(
    key: K,
    value: StorageSchema[K]
  ): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  }
  
  // 更新部分数据
  static async update<K extends keyof StorageSchema>(
    key: K,
    updater: (current: StorageSchema[K] | undefined) => StorageSchema[K]
  ): Promise<void> {
    const current = await this.get(key);
    const updated = updater(current);
    await this.set(key, updated);
  }
  
  // 监听变化
  static onChange<K extends keyof StorageSchema>(
    key: K,
    callback: (
      newValue: StorageSchema[K] | undefined,
      oldValue: StorageSchema[K] | undefined
    ) => void
  ): () => void {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange }
    ) => {
      if (changes[key]) {
        callback(changes[key].newValue, changes[key].oldValue);
      }
    };
    
    chrome.storage.onChanged.addListener(listener);
    
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }
}

// 使用示例
const saveUserSettings = async (settings: UserSettings) => {
  await TypedStorage.set('userSettings', settings);
};

const loadUserSettings = async (): Promise<UserSettings> => {
  const settings = await TypedStorage.get('userSettings');
  return settings ?? getDefaultSettings();
};
```

### 3. 消息传递类型安全
```typescript
// 消息类型定义
interface MessageMap {
  GET_CURRENT_TAB: {
    request: {};
    response: chrome.tabs.Tab | null;
  };
  UPDATE_TAB: {
    request: {
      tabId: number;
      updateProperties: chrome.tabs.UpdateProperties;
    };
    response: chrome.tabs.Tab;
  };
  SAVE_SETTINGS: {
    request: {
      settings: Partial<UserSettings>;
    };
    response: {
      success: boolean;
    };
  };
}

// 类型安全的消息发送器
class TypedMessenger {
  static async send<T extends keyof MessageMap>(
    type: T,
    request: MessageMap[T]['request']
  ): Promise<MessageMap[T]['response']> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type, ...request },
        (response: MessageMap[T]['response']) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        }
      );
    });
  }
  
  static addListener<T extends keyof MessageMap>(
    type: T,
    handler: (
      request: MessageMap[T]['request'],
      sender: chrome.runtime.MessageSender
    ) => MessageMap[T]['response'] | Promise<MessageMap[T]['response']>
  ): () => void {
    const listener = async (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: any) => void
    ) => {
      if (message.type === type) {
        try {
          const response = await handler(message, sender);
          sendResponse(response);
        } catch (error) {
          sendResponse({ error: error.message });
        }
        return true; // 保持消息通道开放
      }
    };
    
    chrome.runtime.onMessage.addListener(listener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }
}

// 使用示例
// 发送消息
const currentTab = await TypedMessenger.send('GET_CURRENT_TAB', {});

// 监听消息
const removeListener = TypedMessenger.addListener(
  'UPDATE_TAB',
  async ({ tabId, updateProperties }) => {
    const updatedTab = await chrome.tabs.update(tabId, updateProperties);
    return updatedTab;
  }
);
```

## React 组件类型定义

### 1. 组件 Props 类型
```typescript
// 基础组件 Props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size}`}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

// 复杂组件 Props
interface TabListProps {
  tabs: StrictTab[];
  selectedTabIds: Set<number>;
  onTabSelect: (tabId: number) => void;
  onTabClose: (tabId: number) => void;
  onTabsReorder?: (fromIndex: number, toIndex: number) => void;
  renderTab?: (tab: StrictTab) => React.ReactNode;
  filter?: {
    query: string;
    includeIncognito: boolean;
  };
  groupBy?: 'domain' | 'window' | 'none';
}

// 泛型组件 Props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemSelect?: (item: T) => void;
  keyExtractor: (item: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
}

const List = <T,>({
  items,
  renderItem,
  onItemSelect,
  keyExtractor,
  loading = false,
  emptyMessage = 'No items'
}: ListProps<T>) => {
  if (loading) return <div>Loading...</div>;
  if (items.length === 0) return <div>{emptyMessage}</div>;
  
  return (
    <ul>
      {items.map((item, index) => (
        <li 
          key={keyExtractor(item)}
          onClick={() => onItemSelect?.(item)}
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
};
```

### 2. Hook 类型定义
```typescript
// 自定义 Hook 类型
interface UseChromeStorageResult<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  save: (value: T) => Promise<void>;
  remove: () => Promise<void>;
}

function useChromeStorage<T>(
  key: string,
  defaultValue?: T
): UseChromeStorageResult<T> {
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const save = useCallback(async (value: T) => {
    try {
      await chrome.storage.local.set({ [key]: value });
      setData(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [key]);
  
  const remove = useCallback(async () => {
    try {
      await chrome.storage.local.remove([key]);
      setData(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [key]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await chrome.storage.local.get([key]);
        setData(result[key] ?? defaultValue);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [key, defaultValue]);
  
  return { data, loading, error, save, remove };
}

// 状态管理 Hook 类型
interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncState<T> {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null
  });
  
  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction(...args);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [asyncFunction]);
  
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);
  
  return { ...state, execute, reset };
}
```

### 3. Context 类型定义
```typescript
// 应用上下文类型
interface AppContextType {
  user: User | null;
  settings: UserSettings;
  permissions: string[];
  theme: Theme;
  actions: {
    updateSettings: (settings: Partial<UserSettings>) => void;
    setTheme: (theme: Theme) => void;
    requestPermissions: (permissions: string[]) => Promise<boolean>;
  };
}

const AppContext = createContext<AppContextType | null>(null);

// 类型安全的 Context Hook
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Provider 组件
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>(getDefaultSettings());
  const [permissions, setPermissions] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>('light');
  
  const actions = useMemo(() => ({
    updateSettings: (newSettings: Partial<UserSettings>) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
    },
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
    requestPermissions: async (perms: string[]): Promise<boolean> => {
      const granted = await chrome.permissions.request({ 
        permissions: perms 
      });
      if (granted) {
        setPermissions(prev => [...new Set([...prev, ...perms])]);
      }
      return granted;
    }
  }), []);
  
  const value: AppContextType = {
    user,
    settings,
    permissions,
    theme,
    actions
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

## 错误处理和类型安全

### 1. 结果类型模式
```typescript
// Result 类型定义
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// 安全的异步操作
async function safeAsyncOperation<T>(
  operation: () => Promise<T>
): Promise<Result<T, string>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// 使用示例
const TabManager = () => {
  const [tabs, setTabs] = useState<StrictTab[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const loadTabs = async () => {
    const result = await safeAsyncOperation(async () => {
      const tabs = await chrome.tabs.query({});
      return tabs.filter(isValidTab);
    });
    
    if (result.success) {
      setTabs(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
  };
  
  return (
    <div>
      {error && <ErrorMessage message={error} />}
      <TabList tabs={tabs} />
    </div>
  );
};
```

### 2. 类型守卫和验证
```typescript
// 运行时类型检查
const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

const isArray = <T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T
): value is T[] => {
  return Array.isArray(value) && value.every(itemGuard);
};

// 复杂对象验证
const isUserSettings = (value: unknown): value is UserSettings => {
  if (typeof value !== 'object' || value === null) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') &&
    typeof obj.notifications === 'object' &&
    obj.notifications !== null &&
    typeof (obj.notifications as any).enabled === 'boolean'
  );
};

// 安全的数据解析
function parseStorageData<T>(
  data: unknown,
  guard: (value: unknown) => value is T,
  defaultValue: T
): T {
  if (guard(data)) {
    return data;
  }
  
  console.warn('Invalid data format, using default value:', data);
  return defaultValue;
}

// 使用示例
const loadSettings = async (): Promise<UserSettings> => {
  const result = await chrome.storage.local.get(['userSettings']);
  return parseStorageData(
    result.userSettings,
    isUserSettings,
    getDefaultSettings()
  );
};
```

### 3. 错误边界类型
```typescript
interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class TypedErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // 发送错误报告
    this.reportError(error, errorInfo);
  }
  
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    console.error('Extension Error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  };
  
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }
    
    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="error-boundary">
    <h2>Something went wrong</h2>
    <details>
      <summary>Error details</summary>
      <pre>{error.message}</pre>
    </details>
  </div>
);
```

## 开发工具和配置

### 1. TypeScript 配置优化
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    // 路径映射
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    },
    
    // 严格检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true
  },
  "include": [
    "src/**/*",
    "entrypoints/**/*",
    "components/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    ".wxt"
  ]
}
```

### 2. ESLint 配置
```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### 3. 类型声明文件
```typescript
// src/types/global.d.ts
declare global {
  interface Window {
    __EXTENSION_DEBUG__: boolean;
  }
}

// src/types/chrome.d.ts
declare namespace chrome.runtime {
  interface ExtensionMessageEvent extends MessageEvent {
    data: {
      type: string;
      payload: any;
    };
  }
}

// src/types/modules.d.ts
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
```

## 实践练习

### 练习 1: 类型安全的配置管理
创建一个类型安全的配置管理系统：
- [ ] 定义完整的配置接口
- [ ] 实现类型安全的读写操作
- [ ] 添加运行时验证
- [ ] 支持配置迁移

### 练习 2: 消息传递系统
构建类型安全的消息传递机制：
- [ ] 定义消息类型映射
- [ ] 实现类型安全的发送器
- [ ] 添加错误处理
- [ ] 支持请求/响应模式

### 练习 3: 组件库开发
开发一套类型完整的组件库：
- [ ] 定义所有组件的 Props 类型
- [ ] 实现泛型组件
- [ ] 添加完整的类型文档
- [ ] 支持主题定制

## 调试和优化

### 1. 类型错误调试
```typescript
// 使用类型断言进行调试
const debugType = <T>(value: T, label?: string): T => {
  console.log(`Type debug${label ? ` (${label})` : ''}:`, typeof value, value);
  return value;
};

// 使用示例
const tabs = debugType(await chrome.tabs.query({}), 'tabs query result');

// 条件类型调试
type Debug<T> = T extends string 
  ? `String: ${T}` 
  : T extends number 
  ? `Number: ${T}` 
  : `Other: ${T}`;

type TestType = Debug<'hello'>; // "String: hello"
```

### 2. 性能监控
```typescript
// 类型安全的性能监控
interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private static entries = new Map<string, PerformanceEntry>();
  
  static start(name: string): void {
    this.entries.set(name, {
      name,
      startTime: performance.now()
    });
  }
  
  static end(name: string): number | null {
    const entry = this.entries.get(name);
    if (!entry) return null;
    
    const endTime = performance.now();
    const duration = endTime - entry.startTime;
    
    this.entries.set(name, {
      ...entry,
      endTime,
      duration
    });
    
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  static getAll(): PerformanceEntry[] {
    return Array.from(this.entries.values());
  }
}

// 使用示例
PerformanceMonitor.start('loadTabs');
const tabs = await chrome.tabs.query({});
PerformanceMonitor.end('loadTabs');
```

## 总结

通过本章学习，你应该掌握：

✅ **TypeScript 基础和高级特性**
- 类型系统和类型操作
- 泛型和条件类型
- 工具类型的使用

✅ **Chrome API 类型安全**
- 扩展原生类型定义
- 类型安全的存储操作
- 消息传递类型系统

✅ **React 组件类型定义**
- Props 和 Hook 类型
- Context 类型安全
- 错误边界处理

✅ **开发工具和最佳实践**
- 配置优化
- 调试技巧
- 性能监控

下一章我们将学习 Tailwind CSS，为你的扩展构建现代化的用户界面。
