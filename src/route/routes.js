import Home from '../components/Home';
// import Profile from '../components/Profile';
import A from '../components/A';
import B from '../components/B';
import C from '../components/C';
import Search from '../components/Search';
import EssayPage from '../components/EssayPage';
import MusicPage from '../components/MusicPage';
import MoviePage from '../components/MoviePage';
import QuestionPage from '../components/QuestionPage';
import VideoPage from '../components/VideoPage';
import AuhtorPage from '../components/AuthorPage.vue';
import SearchResultPage from '../components/SearchResultPage';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/reading',
    component: Home,
  },
  {
    path: '/music',
    component: Home,
  },
  {
    path: '/movie',
    component: Home,
  },
  {
    path: '/profile',
    component: VideoPage,
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/search/:key',
    component: SearchResultPage,
  },
  {
    path: '/profile/ablsum',
    component: A,
  },
  {
    path: '/profile/right',
    component: C,
  },
  {
    path: 'right',
    component: B,
  },
  {
    path: '/essay/:id',
    component: EssayPage,
  },
  {
    path: '/music/:id',
    component: MusicPage,
  },
  {
    path: '/movie/:id',
    component: MoviePage,
    children: [
      {
        path: 'video',
        name: 'video',
        component: VideoPage,
      },
    ],
  },
  {
    path: '/question/:id',
    component: QuestionPage,
  },
  {
    path: '/author/:authorId',
    component: AuhtorPage,
  },
];

export default routes;
