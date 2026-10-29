import { ThemeProvider } from './lib/theme';
import { useHashRoute, parseRoute } from './lib/router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import AIChatbot from './components/AIChatbot';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ServicesPage from './pages/ServicesPage';
import PricingPage from './pages/PricingPage';
import PlatformsPage from './pages/PlatformsPage';
import GigsPage from './pages/GigsPage';
import GigDetailPage from './pages/GigDetailPage';
import GrowthPage from './pages/GrowthPage';
import BlogPage from './pages/BlogPage';
import BlogArticlePage from './pages/BlogArticlePage';
import ContactPage from './pages/ContactPage';
import TeamPage from './pages/TeamPage';
import CareersPage from './pages/CareersPage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function Routes() {
  const { route } = useHashRoute();
  const { segments } = parseRoute(route);

  let page: React.ReactNode;
  if (segments.length === 0) page = <HomePage />;
  else if (segments[0] === 'portfolio' && !segments[1]) page = <PortfolioPage />;
  else if (segments[0] === 'portfolio' && segments[1]) page = <ProjectDetailPage id={segments[1]} />;
  else if (segments[0] === 'services') page = <ServicesPage />;
  else if (segments[0] === 'pricing') page = <PricingPage />;
  else if (segments[0] === 'platforms') page = <PlatformsPage />;
  else if (segments[0] === 'growth') page = <GrowthPage />;
  else if (segments[0] === 'gigs' && !segments[1]) page = <GigsPage />;
  else if (segments[0] === 'gigs' && segments[1]) page = <GigDetailPage id={segments[1]} />;
  else if (segments[0] === 'blog' && !segments[1]) page = <BlogPage />;
  else if (segments[0] === 'blog' && segments[1]) page = <BlogArticlePage id={segments[1]} />;
  else if (segments[0] === 'contact') page = <ContactPage />;
  else if (segments[0] === 'team') page = <TeamPage />;
  else if (segments[0] === 'careers') page = <CareersPage />;
  else if (segments[0] === 'terms') page = <TermsPage />;
  else if (segments[0] === 'admin') page = <AdminPage />;
  else page = <NotFoundPage />;

  const isAdmin = segments[0] === 'admin';

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex-1">{page}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingButtons />}
      {!isAdmin && <AIChatbot />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
}
