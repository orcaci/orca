import * as React from "react"
import { Button } from "./button"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Badge } from "./badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Separator } from "./separator"
import { cn } from "../../utils/cn"
import { 
  Settings, 
  LogOut, 
  User, 
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Zap,
  Activity,
  Globe
} from "lucide-react"

interface ModernNavProps {
  title?: string
  subtitle?: string
  logoUrl?: string
  isRecording?: boolean
  recordingName?: string
  actionCount?: number
  connectionStatus?: 'connected' | 'disconnected' | 'connecting'
  onOpenSettings?: () => void
  onLogout?: () => void
  onToggleRecording?: () => void
  className?: string
  variant?: 'default' | 'glass' | 'minimal'
}

export const ModernNav: React.FC<ModernNavProps> = ({
  title = "Orca Test Recorder",
  subtitle,
  logoUrl,
  isRecording = false,
  recordingName,
  actionCount = 0,
  connectionStatus = 'connected',
  onOpenSettings,
  onLogout,
  onToggleRecording,
  className,
  variant = 'default'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500'
      case 'connecting': return 'text-yellow-500'
      case 'disconnected': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Globe className="h-3 w-3" />
      case 'connecting': return <Activity className="h-3 w-3 animate-pulse" />
      case 'disconnected': return <X className="h-3 w-3" />
      default: return <Globe className="h-3 w-3" />
    }
  }

  const navVariants = {
    default: "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
    glass: "bg-background/10 backdrop-blur-xl border-white/10 supports-[backdrop-filter]:bg-background/5",
    minimal: "bg-transparent border-transparent"
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      navVariants[variant],
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {logoUrl && (
                <div className="relative">
                  <img 
                    src={logoUrl} 
                    className="h-8 w-8 rounded-md transition-transform hover:scale-105" 
                    alt="Logo" 
                  />
                  {isRecording && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse border-2 border-background" />
                  )}
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Recording
                </span>
                {recordingName && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm text-muted-foreground max-w-32 truncate">
                      {recordingName}
                    </span>
                  </>
                )}
                {actionCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {actionCount} actions
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Center Section - Search (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search recordings..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <div className="hidden sm:flex items-center space-x-2 px-2 py-1 rounded-md bg-muted/50">
              <div className={cn("flex items-center", getConnectionColor())}>
                {getConnectionIcon()}
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {connectionStatus}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center space-x-1">
              {/* Recording Toggle */}
              {onToggleRecording && (
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="sm"
                  onClick={onToggleRecording}
                  className="relative overflow-hidden group"
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    isRecording ? "bg-gradient-to-r from-red-600 to-red-500" : "bg-gradient-to-r from-primary to-primary/80"
                  )} />
                  <div className="relative flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {isRecording ? 'Stop' : 'Record'}
                    </span>
                  </div>
                </Button>
              )}

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-muted/80 transition-colors">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Test User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      test@orca.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onOpenSettings && (
                  <DropdownMenuItem onClick={onOpenSettings} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onLogout && (
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Recording Status Mobile */}
              {isRecording && (
                <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-500/10">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-red-600">Recording</span>
                  {recordingName && (
                    <span className="text-sm text-muted-foreground">• {recordingName}</span>
                  )}
                  {actionCount > 0 && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {actionCount}
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Search Mobile */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search recordings..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Connection Status Mobile */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">Connection</span>
                <div className={cn("flex items-center space-x-1", getConnectionColor())}>
                  {getConnectionIcon()}
                  <span className="text-sm capitalize">{connectionStatus}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}