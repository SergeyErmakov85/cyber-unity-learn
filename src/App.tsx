import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { PageSkeleton } from "@/components/SkeletonCard";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RouteScrollToTop from "@/components/RouteScrollToTop";
import Index from "./pages/Index";

// Lazy-loaded pages for performance
const CodeExamples = lazy(() => import("./pages/CodeExamples"));
const MathRL = lazy(() => import("./pages/MathRL"));
const PyTorchModule = lazy(() => import("./pages/PyTorchModule"));
const PyTorchCheatSheet = lazy(() => import("./pages/PyTorchCheatSheet"));
const UnityMLAgentsModule = lazy(() => import("./pages/UnityMLAgentsModule"));
const AlgorithmsHub = lazy(() => import("./pages/AlgorithmsHub"));
const PPOModule = lazy(() => import("./pages/PPOModule"));
const SACModule = lazy(() => import("./pages/SACModule"));
const DQNModule = lazy(() => import("./pages/DQNModule"));
const A3CModule = lazy(() => import("./pages/A3CModule"));
const UnityProjectsHub = lazy(() => import("./pages/UnityProjectsHub"));
const FoodCollectorProject = lazy(() => import("./pages/FoodCollectorProject"));
const TaxiProject = lazy(() => import("./pages/TaxiProject"));
const BallBalanceProject = lazy(() => import("./pages/BallBalanceProject"));
const GridWorldProject = lazy(() => import("./pages/GridWorldProject"));
const RacingCarProject = lazy(() => import("./pages/RacingCarProject"));
const SoccerProject = lazy(() => import("./pages/SoccerProject"));
const QLearningViz = lazy(() => import("./pages/QLearningViz"));
const Visualizations = lazy(() => import("./pages/Visualizations"));
const AdvancedTopics = lazy(() => import("./pages/AdvancedTopics"));
const OnnxSentisGuide = lazy(() => import("./pages/OnnxSentisGuide"));
const Labs = lazy(() => import("./pages/Labs"));
const ResearchIndex = lazy(() => import("./pages/ResearchIndex"));
const DemoProject = lazy(() => import("./pages/DemoProject"));
const DeepRLModule = lazy(() => import("./pages/DeepRLModule"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseLesson1_1 = lazy(() => import("./pages/CourseLesson1_1"));
const CourseLesson1_2 = lazy(() => import("./pages/CourseLesson1_2"));
const CourseLesson1_3 = lazy(() => import("./pages/CourseLesson1_3"));
const CourseLesson1_4 = lazy(() => import("./pages/CourseLesson1_4"));
const CourseLesson1_5 = lazy(() => import("./pages/CourseLesson1_5"));
const CourseLesson1_6 = lazy(() => import("./pages/CourseLesson1_6"));
const CourseLesson1_7 = lazy(() => import("./pages/CourseLesson1_7"));
const CourseProject1 = lazy(() => import("./pages/CourseProject1"));
const CourseLesson2_1 = lazy(() => import("./pages/CourseLesson2_1"));
const CourseLesson2_2 = lazy(() => import("./pages/CourseLesson2_2"));
const CourseLesson2_3 = lazy(() => import("./pages/CourseLesson2_3"));
const CourseLesson2_4 = lazy(() => import("./pages/CourseLesson2_4"));
const CourseLesson2_5 = lazy(() => import("./pages/CourseLesson2_5"));
const CourseLesson2_6 = lazy(() => import("./pages/CourseLesson2_6"));
const CourseProject2 = lazy(() => import("./pages/CourseProject2"));
const CourseProject3 = lazy(() => import("./pages/CourseProject3"));
const CourseLesson3_1 = lazy(() => import("./pages/CourseLesson3_1"));
const CourseLesson3_2 = lazy(() => import("./pages/CourseLesson3_2"));
const CourseLesson3_3 = lazy(() => import("./pages/CourseLesson3_3"));
const CourseLesson3_4 = lazy(() => import("./pages/CourseLesson3_4"));
const CourseLesson3_5 = lazy(() => import("./pages/CourseLesson3_5"));
const CourseLesson3_6 = lazy(() => import("./pages/CourseLesson3_6"));
const CourseLesson3_7 = lazy(() => import("./pages/CourseLesson3_7"));
const CourseLesson3_8 = lazy(() => import("./pages/CourseLesson3_8"));

const Blog = lazy(() => import("./pages/Blog"));
const BlogPpoVsSac = lazy(() => import("./pages/BlogPpoVsSac"));
const BlogTop5Mistakes = lazy(() => import("./pages/BlogTop5Mistakes"));
const BlogParallelEnvs = lazy(() => import("./pages/BlogParallelEnvs"));
const BlogMapoca = lazy(() => import("./pages/BlogMapoca"));
const BlogJupyterToUnity = lazy(() => import("./pages/BlogJupyterToUnity"));
const BlogGridSensor = lazy(() => import("./pages/BlogGridSensor"));
const BlogReinforceVsPpo = lazy(() => import("./pages/BlogReinforceVsPpo"));
const BlogOnnxSentis = lazy(() => import("./pages/BlogOnnxSentis"));
const Pricing = lazy(() => import("./pages/Pricing"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Community = lazy(() => import("./pages/Community"));
const OnboardingQuiz = lazy(() => import("./pages/OnboardingQuiz"));
const CertificatePreview = lazy(() => import("./pages/CertificatePreview"));
const DemoPage = lazy(() => import("./pages/DemoPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const HubPage = lazy(() => import("./pages/HubPage"));
const FcaRlModule = lazy(() => import("./pages/FcaRlModule"));
const FrozenLakeProject = lazy(() => import("./pages/FrozenLakeProject"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => <PageSkeleton />;

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/beginner-course" element={<Navigate to="/courses/1-1" replace />} />
            <Route path="/code-examples" element={<CodeExamples />} />
            <Route path="/math-rl" element={<MathRL />} />
            <Route path="/math-rl/module-1" element={<MathRL />} />
            <Route path="/math-rl/module-2" element={<MathRL />} />
            <Route path="/math-rl/module-3" element={<MathRL />} />
            <Route path="/math-rl/module-4" element={<MathRL />} />
            <Route path="/math-rl/module-5" element={<MathRL />} />
            <Route path="/math-rl/module-6" element={<MathRL />} />
            <Route path="/pytorch" element={<PyTorchModule />} />
            <Route path="/pytorch/cheatsheet" element={<PyTorchCheatSheet />} />
            <Route path="/unity-ml-agents" element={<UnityMLAgentsModule />} />
            <Route path="/algorithms" element={<AlgorithmsHub />} />
            <Route path="/algorithms/ppo" element={<PPOModule />} />
            <Route path="/algorithms/sac" element={<SACModule />} />
            <Route path="/algorithms/dqn" element={<DQNModule />} />
            <Route path="/algorithms/a3c" element={<A3CModule />} />
            <Route path="/unity-projects" element={<UnityProjectsHub />} />
            <Route path="/unity-projects/food-collector" element={<FoodCollectorProject />} />
            <Route path="/unity-projects/taxi-v3" element={<TaxiProject />} />
            <Route path="/unity-projects/ball-balance" element={<BallBalanceProject />} />
            <Route path="/unity-projects/gridworld" element={<GridWorldProject />} />
            <Route path="/unity-projects/racing" element={<RacingCarProject />} />
            <Route path="/unity-projects/soccer" element={<SoccerProject />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/visualizations/q-learning" element={<QLearningViz />} />
            <Route path="/advanced" element={<AdvancedTopics />} />
            <Route path="/advanced/onnx-sentis" element={<OnnxSentisGuide />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/hub/research" element={<ResearchIndex />} />
            <Route path="/demo-project" element={<DemoProject />} />
            <Route path="/deep-rl" element={<DeepRLModule />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/1-1" element={<CourseLesson1_1 />} />
            <Route path="/courses/1-2" element={<CourseLesson1_2 />} />
            <Route path="/courses/1-3" element={<CourseLesson1_3 />} />
            <Route path="/courses/1-4" element={<CourseLesson1_4 />} />
            <Route path="/courses/1-5" element={<CourseLesson1_5 />} />
            <Route path="/courses/1-6" element={<CourseLesson1_6 />} />
            <Route path="/courses/1-7" element={<CourseLesson1_7 />} />
            <Route path="/courses/project-1" element={<CourseProject1 />} />
            <Route path="/courses/2-1" element={<CourseLesson2_1 />} />
            <Route path="/courses/2-2" element={<CourseLesson2_2 />} />
            <Route path="/courses/2-3" element={<CourseLesson2_3 />} />
            <Route path="/courses/2-4" element={<CourseLesson2_4 />} />
            <Route path="/courses/2-5" element={<CourseLesson2_5 />} />
            <Route path="/courses/2-6" element={<CourseLesson2_6 />} />
            <Route path="/courses/project-2" element={<CourseProject2 />} />
            <Route path="/courses/project-3" element={<CourseProject3 />} />
            <Route path="/courses/3-1" element={<CourseLesson3_1 />} />
            <Route path="/courses/3-2" element={<CourseLesson3_2 />} />
            <Route path="/courses/3-3" element={<CourseLesson3_3 />} />
            <Route path="/courses/3-4" element={<CourseLesson3_4 />} />
            <Route path="/courses/3-5" element={<CourseLesson3_5 />} />
            <Route path="/courses/3-6" element={<CourseLesson3_6 />} />
            <Route path="/courses/3-7" element={<CourseLesson3_7 />} />
            <Route path="/courses/3-8" element={<CourseLesson3_8 />} />
            
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/ppo-vs-sac" element={<BlogPpoVsSac />} />
            <Route path="/blog/top-5-mistakes" element={<BlogTop5Mistakes />} />
            <Route path="/blog/parallel-envs" element={<BlogParallelEnvs />} />
            <Route path="/blog/mapoca-guide" element={<BlogMapoca />} />
            <Route path="/blog/jupyter-to-unity" element={<BlogJupyterToUnity />} />
            <Route path="/blog/gridsensor-guide" element={<BlogGridSensor />} />
            <Route path="/blog/reinforce-vs-ppo" element={<BlogReinforceVsPpo />} />
            <Route path="/blog/onnx-sentis-pipeline" element={<BlogOnnxSentis />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/community" element={<Community />} />
            <Route path="/onboarding" element={<OnboardingQuiz />} />
            <Route path="/certificate-preview" element={<CertificatePreview />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/fca-rl" element={<FcaRlModule />} />
            <Route path="/projects/frozen-lake" element={<FrozenLakeProject />} />
            <Route path="/hub/:hubId" element={<HubPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
