// "use strict";
$(".modal").draggable({
    handle: ".modal-header"
});
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

    $('[data-toggle="tooltip"]').tooltip()

    window.addEventListener('load', function () {
        $('.preloader').fadeOut()
        domFactory.handler.upgradeAll()
    })
    
    $('[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        $(e.target).removeClass('active')
    })
})()

$(document).ready(function () {

    $("#LogOut, #mdlLogout, #LogMeOut").click(function () {
        localStorage.clear();
        sessionStorage.clear();
    });

    //do these before any modal pops up
    $("#modal-declare").on('show.bs.modal', function () {
        $(this).find('input[type="checkbox"]').prop('checked', false);
        $(this).find(".transButtons").prop("disabled", true);
    });
});
