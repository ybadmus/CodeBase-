(function () {
    'use strict';
    // Self Initialize DOM Factory Components
    domFactory.handler.autoInit()

    // Connect button(s) to drawer(s)
    var sidebarToggle = document.querySelectorAll('[data-toggle="sidebar"]')
    sidebarToggle = Array.prototype.slice.call(sidebarToggle)

    sidebarToggle.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            var selector = e.currentTarget.getAttribute('data-target') || '#default-drawer'
            var drawer = document.querySelector(selector)
            if (drawer) {
                drawer.mdkDrawer.toggle()
            }
        })
    })

    let drawers = document.querySelectorAll('.mdk-drawer')
    drawers = Array.prototype.slice.call(drawers)
    drawers.forEach((drawer) => {
        drawer.addEventListener('mdk-drawer-change', (e) => {
            if (!e.target.mdkDrawer) {
                return
            }
            document.querySelector('body').classList[e.target.mdkDrawer.opened ? 'add' : 'remove']('has-drawer-opened')
            let button = document.querySelector('[data-target="#' + e.target.id + '"]')
            if (button) {
                button.classList[e.target.mdkDrawer.opened ? 'add' : 'remove']('active')
            }
        })
    })

    // SIDEBAR COLLAPSE MENUS
    $('.sidebar .collapse').on('show.bs.collapse', function (e) {
        e.stopPropagation()
        var parent = $(this).parents('.sidebar-submenu').get(0) || $(this).parents('.sidebar-menu').get(0)
        $(parent).find('.open').find('.collapse').collapse('hide');
        $(this).closest('li').addClass('open');
    });
    $('.sidebar .collapse').on('hidden.bs.collapse', function (e) {
        e.stopPropagation()
        $(this).closest('li').removeClass('open');
    });

    // ENABLE TOOLTIPS
    $('[data-toggle="tooltip"]').tooltip()

    // PRELOADER
    window.addEventListener('load', function () {
        $('.preloader').fadeOut()
        domFactory.handler.upgradeAll()
    })

})();

(function () {
    'use strict';

    $('[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        $(e.target).removeClass('active')
    })

})();

(function () {
    'use strict';

    //Charts.init()

    var EarningsTraffic = function (id, type = 'line', options = {}) {
        options = Chart.helpers.merge({
            elements: {
                line: {
                    fill: 'start',
                    backgroundColor: settings.charts.colors.area
                }
            }
        }, options)

        var data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Traffic",
                data: [10, 2, 5, 15, 10, 12, 15, 25, 22, 30, 25, 40]
            }]
        }

        Charts.create(id, type, options, data)
    }

    var Products = function (id, type = 'line', options = {}, data) {
        options = Chart.helpers.merge({
            elements: {
                line: {
                    fill: 'start',
                    backgroundColor: settings.charts.colors.area,
                    tension: 0,
                    borderWidth: 1
                },
                point: {
                    pointStyle: 'circle',
                    radius: 5,
                    hoverRadius: 5,
                    backgroundColor: settings.colors.white,
                    borderColor: settings.colors.primary[700],
                    borderWidth: 2
                }
            },
            scales: {
                yAxes: [{
                    display: false
                }],
                xAxes: [{
                    display: false
                }]
            }
        }, options)

        data = data || {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Earnings",
                data: [400, 200, 450, 460, 220, 380, 800]
            }]
        }

        Charts.create(id, type, options, data)
    }

    var Courses = function (id, type = 'line', options = {}) {
        options = Chart.helpers.merge({
            elements: {
                line: {
                    borderColor: settings.colors.success[700],
                    backgroundColor: settings.hexToRGB(settings.colors.success[100], 0.5)
                },
                point: {
                    borderColor: settings.colors.success[700]
                }
            }
        }, options)

        Products(id, type, options)
    }

    var LocationDoughnut = function (id, type = 'doughnut', options = {}) {
        options = Chart.helpers.merge({
            tooltips: {
                callbacks: {
                    title: function (a, e) {
                        return e.labels[a[0].index]
                    },
                    label: function (a, e) {
                        var t = "";
                        return t += '<span class="popover-body-value">' + e.datasets[0].data[a.index] + "%</span>"
                    }
                }
            }
        }, options)

        var data = {
            labels: ["United States", "United Kingdom", "Germany", "India"],
            datasets: [{
                data: [25, 25, 15, 35],
                backgroundColor: [settings.colors.success[400], settings.colors.danger[400], settings.colors.primary[500], settings.colors.gray[300]],
                hoverBorderColor: "dark" == settings.charts.colorScheme ? settings.colors.gray[800] : settings.colors.white
            }]
        }

        Charts.create(id, type, options, data)
    }

    ///////////////////
    // Create Charts //
    ///////////////////

    //EarningsTraffic('#earningsTrafficChart')
    //LocationDoughnut('#locationDoughnutChart')
    //Products('#productsChart')
    //Courses('#coursesChart')

})();