import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import BookIcon from '@material-ui/icons/Book';
import Notifications from "@material-ui/icons/Notifications";
import DashboardPage from "./views/Dashboard/Dashboard.js";
import UserProfile from "./views/UserProfile/UserProfile.js";
import TableList from "./views/TableList/TableList.js";
import Typography from "./views/Typography/Typography.js";
import NotificationsPage from "./views/Notifications/Notifications.js";
import PeopleIcon from '@material-ui/icons/People';

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Table List",
    icon: PeopleIcon,
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Blogs",
    icon: BookIcon,
    component: Typography,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin",
  },
];

export default dashboardRoutes;
