// import Questions from 'layouts/Quesions'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/questions',
    component: () => import('layouts/Questions.vue'),
    children: [
      { path: '/asking/:roomName', component: () => import('pages/Questions.vue') },
      { path: '/asking', component: () => import('pages/Error404.vue') }
    ]
  },
  {
    path: '/roomselect',
    component: () => import('layouts/RoomSelect.vue'),
    children: [
      { path: '/RoomSelect', component: () => import('pages/RoomSelect.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes