<!DOCTYPE html>
<html lang="en">


<!-- Mirrored from demo.dashboardpack.com/admindek-html/default/auth-sign-in-social.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 07 Sep 2020 13:57:02 GMT -->
<!-- Added by HTTrack -->
<meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->

<head>
    <title>Litt | Admin Panel</title>
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
    <meta name="description"
        content="Admindek Bootstrap admin template made using Bootstrap 4 and it has huge amount of ready made feature, UI components, pages which completely fulfills any dashboard needs." />
    <meta name="keywords"
        content="bootstrap, bootstrap admin template, admin theme, admin dashboard, dashboard template, admin template, responsive" />
    <meta name="author" content="colorlib" />
    <!-- Favicon icon -->

    <link rel="icon" href="{{ url('/admin_assets/assets/images/fav.png') }}" type="image/x-icon">
    <!-- Google font-->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500,700" rel="stylesheet">
    <!-- Required Fremwork -->
    <link rel="stylesheet" type="text/css"
        href="{{ asset('/admin_assets') }}/bower_components/bootstrap/css/bootstrap.min.css">
    <!-- waves.css -->
    <link rel="stylesheet" href="{{ asset('/admin_assets') }}/assets/pages/waves/css/waves.min.css" type="text/css"
        media="all"><!-- feather icon -->
    <link rel="stylesheet" type="text/css" href="{{ asset('/admin_assets') }}/assets/icon/feather/css/feather.css">
    <!-- themify-icons line icon -->
    <link rel="stylesheet" type="text/css"
        href="{{ asset('/admin_assets') }}/assets/icon/themify-icons/themify-icons.css">
    <!-- ico font -->
    <link rel="stylesheet" type="text/css" href="{{ asset('/admin_assets') }}/assets/icon/icofont/css/icofont.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" type="text/css"
        href="{{ asset('/admin_assets') }}/assets/icon/font-awesome/css/font-awesome.min.css">
    <!-- Style.css -->
    <link rel="stylesheet" type="text/css" href="{{ asset('/admin_assets') }}/assets/css/style.css">
    <link rel="stylesheet" type="text/css" href="{{ asset('/admin_assets') }}/assets/css/pages.css">

    <style type="text/css">
        .errors {

            font-size: 14px;

        }

        .errors::-webkit-input-placeholder {
            /* Chrome/Opera/Safari */

            color: red !important;

        }

        .errors::-moz-placeholder {
            /* Firefox 19+ */

            color: red !important;

        }

        .errors:-ms-input-placeholder {
            /* IE 10+ */

            color: red;

        }

        .errors:-moz-placeholder {
            /* Firefox 18- */

            color: red !important;

        }

        .errors_selectbox {

            color: red !important;

        }
    </style>
</head>

<body themebg-pattern="theme1">
    <!-- Pre-loader start -->
    <div class="theme-loader">
        <div class="loader-track">
            <div class="preloader-wrapper">
                <div class="spinner-layer spinner-blue">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
                <div class="spinner-layer spinner-red">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>

                <div class="spinner-layer spinner-yellow">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>

                <div class="spinner-layer spinner-green">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Pre-loader end -->
    <section class="login-block">
        <!-- Container-fluid starts -->
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12">
                    <!-- Authentication card start -->
                    <form class="md-float-material form-material" action="#" method="post" id="loginForm"
                        onsubmit="return login()" autocomplete="off">
                        <div class="text-center">
                            <img src="{{ asset('/admin_assets') }}/assets/images/logo.png" alt="logo.png">
                        </div>
                        <div class="auth-box card">
                            <div class="card-block">
                                <div class="row m-b-20">
                                    <div class="col-md-12">
                                        <h3 class="text-center txt-primary">Sign In</h3>
                                    </div>
                                </div>


                                <div class="form-group form-primary">
                                    <input type="text" name="email" id="email" class="form-control">
                                    <span class="form-bar"></span>
                                    <label class="float-label">Email</label>
                                </div>
                                <div class="form-group form-primary">
                                    <input type="password" name="password" class="form-control" id="password">
                                    <span class="form-bar"></span>
                                    <label class="float-label">Password</label>
                                </div>
                                <div class="row m-t-25 text-left">
                                    <div class="col-12">
                                        <div class="checkbox-fade fade-in-primary">
                                            <!-- <label>
                                                <input type="checkbox" value="">
                                                <span class="cr"><i class="cr-icon icofont icofont-ui-check txt-primary"></i></span>
                                                <span class="text-inverse">Remember me</span>
                                            </label> -->
                                        </div>
                                        <div class="forgot-phone text-right float-right">
                                            {{-- <a href="{{ url('adminpanel/forgotpassword') }}" class="text-right f-w-600"> Forgot Password?</a> --}}
                                        </div>
                                    </div>
                                </div>

                                <div class="social-auth-links text-center mb-3">
                                    <span id="errormsg"></span>
                                </div>

                                <div class="row m-t-30">
                                    <div class="col-md-12">
                                        <button type="submit"
                                            class="btn btn-primary btn-md btn-block waves-effect text-center m-b-20">LOGIN</button>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                    <!-- end of form -->
                </div>
                <!-- Authentication card end -->
            </div>
            <!-- end of col-sm-12 -->
        </div>
        <!-- end of row -->
        </div>
        <!-- end of container-fluid -->
    </section>
    <!-- Warning Section Starts -->
    <!-- Older IE warning message -->
    <!--[if lt IE 10]>
<div class="ie-warning">
    <h1>Warning!!</h1>
    <p>You are using an outdated version of Internet Explorer, please upgrade <br/>to any of the following web browsers to access this website.</p>
    <div class="iew-container">
        <ul class="iew-download">
            <li>
                <a href="http://www.google.com/chrome/">
                    <img src="{{ asset('/admin_assets') }}/assets/images/browser/chrome.png" alt="Chrome">
                    <div>Chrome</div>
                </a>
            </li>
            <li>
                <a href="https://www.mozilla.org/en-US/firefox/new/">
                    <img src="{{ asset('/admin_assets') }}/assets/images/browser/firefox.png" alt="Firefox">
                    <div>Firefox</div>
                </a>
            </li>
            <li>
                <a href="http://www.opera.com">
                    <img src="{{ asset('/admin_assets') }}/assets/images/browser/opera.png" alt="Opera">
                    <div>Opera</div>
                </a>
            </li>
            <li>
                <a href="https://www.apple.com/safari/">
                    <img src="{{ asset('/admin_assets') }}/assets/images/browser/safari.png" alt="Safari">
                    <div>Safari</div>
                </a>
            </li>
            <li>
                <a href="http://windows.microsoft.com/en-us/internet-explorer/download-ie">
                    <img src="{{ asset('/admin_assets') }}/assets/images/browser/ie.png" alt="">
                    <div>IE (9 & above)</div>
                </a>
            </li>
        </ul>
    </div>
    <p>Sorry for the inconvenience!</p>
</div>
<![endif]-->
    <!-- Warning Section Ends -->
    <!-- Required Jquery -->
    <script type="text/javascript" src="{{ asset('/admin_assets') }}/bower_components/jquery/js/jquery.min.js">
    </script>
    <script type="text/javascript" src="{{ asset('/admin_assets') }}/bower_components/jquery-ui/js/jquery-ui.min.js">
    </script>
    <script type="text/javascript" src="{{ asset('/admin_assets') }}/bower_components/popper.js/js/popper.min.js">
    </script>
    <script type="text/javascript" src="{{ asset('/admin_assets') }}/bower_components/bootstrap/js/bootstrap.min.js">
    </script>
    <!-- waves js -->
    <script src="{{ asset('/admin_assets') }}/assets/pages/waves/js/waves.min.js"></script>
    <!-- jquery slimscroll js -->
    <script type="text/javascript"
        src="{{ asset('/admin_assets') }}/bower_components/jquery-slimscroll/js/jquery.slimscroll.js"></script>
    <!-- modernizr js -->
    <script type="text/javascript" src="{{ asset('/admin_assets') }}/bower_components/modernizr/js/modernizr.js">
    </script>
    <script type="text/javascript" src="{{ asset('/admin_assets') }}/bower_components/modernizr/js/css-scrollbars.js">
    </script>
    <script type="text/javascript" src="{{ asset('/admin_assets') }}/assets/js/common-pages.js"></script>

    <script type="text/javascript">
        function login()

        {

            document.getElementById("errormsg").innerHTML = '';

            var email = document.getElementById('email').value.trim();

            var password = document.getElementById('password').value.trim();

            var strUserEml = email.toLowerCase();

            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

            if (email == "")

            {

                document.getElementById('email').style.borderColor = '#ff0000';

                document.getElementById("email").focus();

                $('#email').attr("placeholder", "Please enter email");

                $("#email").addClass("errors");

                return false;

            } else if (!filter.test(strUserEml))

            {

                document.getElementById('email').style.borderColor = '#ff0000';

                document.getElementById("email").focus();

                $('#email').val('');

                $('#email').attr("placeholder", "Invalid e-mail");

                $("#email").addClass("errors");

                return false;

            } else

            {

                document.getElementById("email").style.borderColor = "";

            }

            if (password == "")

            {

                document.getElementById('password').style.borderColor = '#ff0000';

                document.getElementById("password").focus();

                $("#password").val("");

                $('#password').attr("placeholder", "Your password");

                $("#password").addClass("errors");

                return false;

            } else if (password.length < 5 || password.length > 30)

            {

                document.getElementById('password').style.borderColor = '#ff0000';

                document.getElementById("password").focus();

                $("#password").val("");

                $('#password').attr("placeholder", "5-30 characters");

                $("#password").addClass("errors");

                return false;

            } else

            {

                document.getElementById("password").style.borderColor = "";



            }

            var form = new FormData();

            form.append('email', strUserEml);

            form.append('password', password);

            $.ajax({

                headers: {
                    'X-CSRF-Token': '{{ csrf_token() }}'
                },

                type: 'POST',

                url: "{{ url('adminpanel/login') }}",

                data: form,

                cache: false,

                contentType: false,

                processData: false,

                success: function(response)

                {

                    console.log(response);

                    // return false;

                    var status = response.status;

                    var msg = response.msg;

                    var user_id = response.user_id;

                    // return false;

                    if (status == '200')

                    {

                        // document.getElementById("remember").checked = false;

                        var path = "{{ url('adminpanel/dashboard') }}";

                        $("#email,#password").removeClass("errors");

                        $('#password').attr("placeholder", " ");

                        $('#email').attr("placeholder", " ");

                        $("#email,#password").val('');

                        document.getElementById("errormsg").innerHTML = msg;

                        document.getElementById("errormsg").style.color = "#278428";

                        setTimeout(function() {
                            window.location.href = path;
                        }, 2000);

                    } else if (status == '401') {

                        document.getElementById("errormsg").style.color = "#ff0000";

                        document.getElementById("errormsg").innerHTML = response.msg;

                    }

                }



            });

            return false;



        } // end of login functions
    </script>

</body>


<!-- Mirrored from demo.dashboardpack.com/admindek-html/default/auth-sign-in-social.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 07 Sep 2020 13:57:04 GMT -->

</html>
