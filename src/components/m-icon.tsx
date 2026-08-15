import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  BarChart3,
  Bell,
  Bot,
  Braces,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudCheck,
  Code2,
  Compass,
  Download,
  Eye,
  FileText,
  Globe,
  GripVertical,
  Home,
  Inbox,
  LayoutDashboard,
  LineChart,
  Loader2,
  LogOut,
  Mail,
  MailCheck,
  MailOpen,
  Menu,
  MessageSquare,
  Monitor,
  Package,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Rocket,
  Send,
  Settings,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  SquarePen,
  Trash2,
  TrendingUp,
  Upload,
  User,
  X,
  ZoomIn,
  Zap,
} from "lucide-react";

/**
 * Icon registry.
 *
 * Keys are the Material Symbols names the app (and the `Project.cardIcon`
 * column) has always used, so nothing in the database or in any call site
 * needs to change. Values are lucide-react components, which are bundled
 * and tree-shaken — this removes the render-blocking Google Fonts
 * stylesheet the old implementation depended on.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  // navigation & chrome
  home: Home,
  menu: Menu,
  close: X,
  settings: Settings,
  logout: LogOut,
  notifications: Bell,
  dashboard: LayoutDashboard,
  person: User,
  share: Share2,

  // arrows
  arrow_forward: ArrowRight,
  arrow_right_alt: ArrowRight,
  arrow_back: ArrowLeft,
  keyboard_backspace: ArrowLeft,
  arrow_upward: ArrowUp,
  arrow_downward: ArrowDown,
  expand_more: ChevronDown,
  expand_less: ChevronUp,
  open_in_new: ArrowUpRight,
  launch: ArrowUpRight,

  // actions
  add: Plus,
  edit: Pencil,
  edit_note: SquarePen,
  delete: Trash2,
  send: Send,
  refresh: RefreshCw,
  download: Download,
  upload: Upload,
  cloud_upload: Upload,
  visibility: Eye,
  zoom_in: ZoomIn,
  drag_indicator: GripVertical,
  publish: Rocket,
  progress_activity: Loader2,
  check: Check,
  check_circle: CheckCircle2,
  warning: AlertTriangle,

  // contact
  mail: Mail,
  alternate_email: AtSign,
  call: Phone,
  chat_bubble: MessageSquare,
  mark_email_read: MailCheck,
  mark_email_unread: MailOpen,
  inbox: Inbox,

  // content & concepts
  code: Code2,
  data_object: Braces,
  web: Globe,
  language: Globe,
  article: FileText,
  description: FileText,
  devices: Monitor,
  smartphone: Smartphone,
  phonelink: Smartphone,
  psychology: Sparkles,
  robot_2: Bot,
  analytics: BarChart3,
  insights: LineChart,
  trending_up: TrendingUp,
  cloud: Cloud,
  cloud_done: CloudCheck,
  inventory_2: Package,
  work: Package,
  architecture: Compass,
  bolt: Zap,
  shield: Shield,
  palette: Sparkles,
  terminal: Code2,
  verified: CheckCircle2,
  history_edu: Activity,
};

/**
 * Renders an icon by its legacy Material Symbols name.
 *
 * `className` accepts the same Tailwind text-size utilities as before
 * (`text-xl`, `text-4xl`, …) — the size is read from the current font
 * size via `1em`, so existing sizing classes keep working unchanged.
 */
export function MIcon({
  name,
  className = "",
  filled,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  const Icon = ICON_MAP[name] ?? Code2;
  const spin = name === "progress_activity";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <Icon
        className={spin ? "animate-spin" : undefined}
        style={{ width: "1em", height: "1em" }}
        strokeWidth={filled ? 2.4 : 1.75}
        absoluteStrokeWidth
      />
    </span>
  );
}
