// import Questions from 'layouts/Quesions'
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LogIn.vue') }
    ]
  },
  {
    path: '/questions',
    component: () => import('layouts/Questions.vue'),
    children: [
      { path: '/asking/', component: () => import('pages/Questions.vue') }
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
