<!DOCTYPE html>
<html lang="en">


<!-- Mirrored from demo.dashboardpack.com/admindek-html/default/dt-advance.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 07 Sep 2020 13:54:48 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->
<head>
  <title>WS BLog Admin Panel | @yield('title')</title>
  <!-- HTML5 Shim and Respond.js IE10 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 10]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
      <![endif]-->
      <!-- Meta -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="description" content="Admindek Bootstrap admin template made using Bootstrap 4 and it has huge amount of ready made feature, UI components, pages which completely fulfills any dashboard needs." />
      <meta name="keywords" content="bootstrap, bootstrap admin template, admin theme, admin dashboard, dashboard template, admin template, responsive" />
      <meta name="author" content="colorlib" />
      <!-- Favicon icon -->
      <link rel="icon" href="{{url('/admin_assets/assets/images/fav.png')}}" type="image/x-icon">
      <!-- Google font-->
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Quicksand:500,700" rel="stylesheet">
      <!-- Required Fremwork -->
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/bower_components/bootstrap/css/bootstrap.min.css">
      <!-- waves.css -->
      <link rel="stylesheet" href="{{asset('/admin_assets')}}/assets/pages/waves/css/waves.min.css" type="text/css" media="all">
      <!-- feather icon -->
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/icon/feather/css/feather.css">
      <!-- themify-icons line icon -->
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/icon/themify-icons/themify-icons.css">
      <!-- Font Awesome -->
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/icon/font-awesome/css/font-awesome.min.css">
      <!-- Data Table Css -->
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/bower_components/datatables.net-bs4/css/dataTables.bootstrap4.min.css">
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/pages/data-table/css/buttons.dataTables.min.css">
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/bower_components/datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css">
      <!-- Style.css -->
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/css/style.css">
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/css/pages.css">

      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/css/widget.css">
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/css/toastr.css">
      <link rel="stylesheet" type="text/css" href="{{asset('/admin_assets')}}/assets/css/prism.css">
    </head>

    <body>
      <!-- [ Pre-loader ] start -->
      <div class="loader-bg">
        <div class="loader-bar"></div>
      </div>
      <!-- [ Pre-loader ] end -->
      <div id="pcoded" class="pcoded">
        <div class="pcoded-overlay-box"></div>
        <div class="pcoded-container navbar-wrapper">
          <!-- [ Header ] start -->
          <nav class="navbar header-navbar pcoded-header">
            <div class="navbar-wrapper">
              <div class="navbar-logo">
                <a href="{{ url('adminpanel/dashboard') }}">
                  <img class="img-fluid" src="{{asset('/admin_assets')}}/assets/images/logo.png" alt="Theme-Logo" />
                </a>
                <a class="mobile-menu" id="mobile-collapse" href="#!">
                  <i class="feather icon-menu icon-toggle-right"></i>
                </a>
                <a class="mobile-options waves-effect waves-light">
                  <i class="feather icon-more-horizontal"></i>
                </a>
              </div>
              <div class="navbar-container container-fluid">
                <ul class="nav-left">
                  
                  <li>
                    <a href="#!" onclick="javascript:toggleFullScreen()" class="waves-effect waves-light">
                      <i class="full-screen feather icon-maximize"></i>
                    </a>
                  </li>
                </ul>
                <ul class="nav-right">
                
                
                           <li class="user-profile header-notification">

                    <div class="dropdown-primary dropdown">
                      <div class="dropdown-toggle" data-toggle="dropdown">
                        <img src="{{asset('/admin_assets')}}/assets/images/logoblack.png" class="img-fluid" alt="User-Profile-Image">
                        <span>Welcome To WS Blog</span>
                        <i class="feather icon-chevron-down"></i>
                      </div>
                      <ul class="show-notification profile-notification dropdown-menu" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut">
                        {{-- <li>
                          <a href="{{ url('adminpanel/changepassword') }}">
                            <i class="feather icon-settings"></i> Settings

                          </a>
                        </li> --}}
  
                        <li>
                          <a href="{{ url('adminpanel/logout') }}">
                            <i class="feather icon-log-out"></i> Logout

                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

    