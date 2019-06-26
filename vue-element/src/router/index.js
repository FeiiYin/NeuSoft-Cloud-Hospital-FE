import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'
/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/basicInfo',
    component: Layout,
    redirect: 'noRedirect',
    name: 'basicInfo',
    meta: {
      title: '基础信息维护',
      icon: 'example'
    },
    children: [
      {
        path: 'department',
        component: () => import('@/views/basicInfo/department'),
        name: 'department',
        meta: { title: '科室管理', noCache: true }
      },
      {
        path: 'account',
        component: () => import('@/views/basicInfo/account'),
        name: 'account',
        meta: { title: '用户管理', noCache: true }
      },
      {
        path: 'diagnosis',
        component: () => import('@/views/basicInfo/diagnosis'),
        name: 'diagnosis',
        meta: { title: '诊断目录管理', noCache: true }
      },
      {
        path: 'registration_category',
        component: () => import('@/views/basicInfo/registration_category'),
        name: 'registration_category',
        meta: { title: '挂号级别管理', noCache: true }
      },
      {
        path: 'charge_item',
        component: () => import('@/views/basicInfo/charge_item'),
        name: 'charge_item',
        meta: { title: '非药品收费项目管理', noCache: true }
      },
      {
        path: 'settlement_category',
        component: () => import('@/views/basicInfo/settlement_category'),
        name: 'settlement_category',
        meta: { title: '结算类别管理', noCache: true }
      },
      {
        path: 'schedule',
        component: () => import('@/views/basicInfo/schedule'),
        name: 'schedule',
        meta: { title: '医生排班管理', noCache: true }
      },
      {
        path: 'cost',
        component: () => import('@/views/basicInfo/cost'),
        name: 'cost',
        meta: { title: '收据', noCache: true }
      }
    ]
  },
  {
    path: '/registration',
    component: Layout,
    redirect: 'noRedirect',
    name: 'registration',
    meta: {
      title: '门诊挂号收费',
      icon: 'theme'
    },
    children: [
      {
        path: 'registration',
        component: () => import('@/views/registration/registration'),
        name: 'Registration',
        meta: { title: '挂号', noCache: true }
      },
      {
        path: 'registrationListSearch',
        component: () => import('@/views/registration/registrationListSearch'),
        name: 'registrationListSearch',
        meta: { title: '门诊挂号管理', noCache: true }
      },
      {
        path: 'registrationCharge',
        component: () => import('@/views/registration/registrationCharge'),
        name: 'registrationCharge',
        meta: { title: '收费', noCache: true }
      },
      {
        path: 'refund',
        component: () => import('@/views/registration/refund'),
        name: 'refund',
        meta: { title: '退费', noCache: true }
      },
      {
        path: 'patientChargeSearch',
        component: () => import('@/views/registration/patientChargeSearch'),
        name: 'patientChargeSearch',
        meta: { title: '患者费用查询', noCache: true }
      },
      {
        path: 'dailySettlement',
        component: () => import('@/views/registration/dailySettlement'),
        name: 'dailySettlement',
        meta: { title: '日结', noCache: true }
      }
    ]
  },

  {
    path: '/medicalRecord',
    component: Layout,
    redirect: 'noRedirect',
    name: 'medicalRecord',
    meta: {
      title: '门诊医生工作站',
      icon: 'example'
    },
    children: [
      {
        path: 'patientListSearch',
        component: () => import('@/views/medicalRecord/patientListSearch'),
        name: 'patientListSearch',
        meta: { title: '患者查询', noCache: true }
      },
      {
        path: 'medicalRecord',
        component: () => import('@/views/medicalRecord/medicalRecord'),
        name: 'outpatientMedicalRecord',
        meta: { title: '门诊病历信息', noCache: true }
      },
      {
        path: 'examination',
        component: () => import('@/views/medicalRecord/examination'),
        name: 'examination',
        meta: { title: '检查申请', noCache: true }
      },
      {
        path: 'confirmMedicalRecord',
        component: () => import('@/views/medicalRecord/confirmMedicalRecord'),
        name: 'confirmMedicalRecord',
        meta: { title: '确诊', noCache: true }
      },
      {
        path: 'medicinePrescription',
        component: () => import('@/views/medicalRecord/medicinePrescription'),
        name: 'medicinePrescription',
        meta: { title: '成药处方管理', noCache: true }
      },
      {
        path: 'disposalApplication',
        component: () => import('@/views/medicalRecord/disposalApplication'),
        name: 'disposalApplication',
        meta: { title: '处置管理', noCache: true }
      },
      {
        path: 'patientDetail',
        component: () => import('@/views/medicalRecord/patientDetail'),
        name: 'patientDetail',
        meta: { title: '患者详细信息', noCache: true }
      },
      {
        path: 'endMedicalRecord',
        component: () => import('@/views/medicalRecord/endMedicalRecord'),
        name: 'endMedicalRecord',
        meta: { title: '诊断完毕', noCache: true }
      },
      {
        path: 'medicalRecordTemplate',
        component: () => import('@/views/medicalRecord/medicalRecordTemplate'),
        name: 'medicalRecordTemplate',
        meta: { title: '病历模板管理', noCache: true }
      },
      {
        path: 'workload',
        component: () => import('@/views/medicalRecord/workload'),
        name: 'workload',
        meta: { title: '工作量统计', noCache: true }
      }
    ]
  },
  {
    path: '/techWorkstation',
    component: Layout,
    redirect: 'noRedirect',
    name: 'techWorkstation',
    meta: {
      title: '门诊医技工作站',
      icon: 'lock'
    },
    children: [
      {
        path: 'examineIndex',
        component: () => import('@/views/techWorkstation/examineIndex'),
        name: 'examineIndex',
        meta: { title: '检查登记', noCache: true }
      },
      {
        path: 'examineResult',
        component: () => import('@/views/techWorkstation/examineResult'),
        name: 'examineResult',
        meta: { title: '检查结果录入', noCache: true }
      },
      {
        path: 'disposalIndex',
        component: () => import('@/views/techWorkstation/disposalIndex'),
        name: 'disposalIndex',
        meta: { title: '处置结果登记', noCache: true }
      }
    ]
  },
  {
    path: '/pharmacy',
    component: Layout,
    redirect: 'noRedirect',
    name: 'pharmacy',
    meta: {
      title: '门诊药房工作站',
      icon: 'lock'
    },
    children: [
      {
        path: 'dispensingListSearch',
        component: () => import('@/views/pharmacy/dispensingListSearch'),
        name: 'dispensingListSearch',
        meta: { title: '发药列表查询', noCache: true }
      },
      {
        path: 'dispensing',
        component: () => import('@/views/pharmacy/dispensing'),
        name: 'dispensing',
        meta: { title: '发药', noCache: true }
      },
      {
        path: 'withdrawMedicine',
        component: () => import('@/views/pharmacy/withdrawMedicine'),
        name: 'withdrawMedicine',
        meta: { title: '退药', noCache: true }
      },
      {
        path: 'medicine',
        component: () => import('@/views/pharmacy/medicine'),
        name: 'medicine',
        meta: { title: '药品管理', noCache: true }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: 'noRedirect',
    name: 'finance',
    meta: {
      title: '门诊财务管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'costCategory',
        component: () => import('@/views/finance/costCategory'),
        name: 'costCategory',
        meta: { title: '费用科目管理', noCache: true }
      },
      {
        path: 'financeDailyCheck',
        component: () => import('@/views/finance/dailyCheck'),
        name: 'financeDailyCheck',
        meta: { title: '门诊日结核对', noCache: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },
  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
