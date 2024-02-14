const prefix = ""
const configs = {
    getBackendUrl: (suffix) => {return "http://localhost:3000" + suffix},
    tokenKey: "ndh9n43ghf727fo2nfo827byf872",

    homePage: `${prefix}/`,
    registerPage: `${prefix}/register`,
    loginPage: `${prefix}/login`,
    bookingPage: `${prefix}/booking`,
    dashboardPage: `${prefix}/dashboard`,
    adminDashboardPage: `${prefix}/admin`,
}

export default configs