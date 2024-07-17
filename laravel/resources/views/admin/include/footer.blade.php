<!-- Main Footer -->
<footer class="main-footer" style="text-align: center;">
    <!-- To the right -->
    <div class="pull-right hidden-xs">
    <!--   Anything you want -->
    </div>
    <!-- Default to the left -->
    <strong>Copyright &copy; {{date('Y')}} <a href="#">WS Blog</a>.</strong> All rights reserved.
  </footer>


</div>
<!-- ./wrapper -->


<!-- Required Jquery -->
<script type="text/javascript" src="{{url('/admin_assets')}}/bower_components/jquery/js/jquery.min.js"></script>
<script type="text/javascript" src="{{url('/admin_assets')}}/bower_components/jquery-ui/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="{{url('/admin_assets')}}/bower_components/popper.js/js/popper.min.js"></script>
<script type="text/javascript" src="{{url('/admin_assets')}}/bower_components/bootstrap/js/bootstrap.min.js"></script>
<!-- waves js -->
<script src="{{url('/admin_assets')}}/assets/pages/waves/js/waves.min.js"></script>
<!-- jquery slimscroll js -->
<script type="text/javascript" src="{{url('/admin_assets')}}/bower_components/jquery-slimscroll/js/jquery.slimscroll.js"></script>
<!-- modernizr js -->
<script type="text/javascript" src="{{url('/admin_assets')}}/bower_components/modernizr/js/modernizr.js"></script>
<script type="text/javascript" src="{{url('/admin_assets')}}/bower_components/modernizr/js/css-scrollbars.js"></script>
<!-- waves js -->
<script src="{{url('/admin_assets')}}/assets/pages/waves/js/waves.min.js"></script>
<!-- data-table js -->
<script src="{{url('/admin_assets')}}/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="{{url('/admin_assets')}}/bower_components/datatables.net-buttons/js/dataTables.buttons.min.js"></script>
<script src="{{url('/admin_assets')}}/assets/pages/data-table/js/jszip.min.js"></script>
<script src="{{url('/admin_assets')}}/assets/pages/data-table/js/pdfmake.min.js"></script>
<script src="{{url('/admin_assets')}}/assets/pages/data-table/js/vfs_fonts.js"></script>
<script src="{{url('/admin_assets')}}/bower_components/datatables.net-buttons/js/buttons.print.min.js"></script>
<script src="{{url('/admin_assets')}}/bower_components/datatables.net-buttons/js/buttons.html5.min.js"></script>
<script src="{{url('/admin_assets')}}/bower_components/datatables.net-bs4/js/dataTables.bootstrap4.min.js"></script>
<script src="{{url('/admin_assets')}}/bower_components/datatables.net-responsive/js/dataTables.responsive.min.js"></script>
<script src="{{url('/admin_assets')}}/bower_components/datatables.net-responsive-bs4/js/responsive.bootstrap4.min.js"></script>
<!-- Custom js -->
<script src="{{url('/admin_assets')}}/assets/pages/data-table/js/data-table-custom.js"></script>
<script src="{{url('/admin_assets')}}/assets/js/pcoded.min.js"></script>
<script src="{{url('/admin_assets')}}/assets/js/vertical/vertical-layout.min.js"></script>
<script src="{{url('/admin_assets')}}/assets/js/jquery.mCustomScrollbar.concat.min.js"></script>
<script type="text/javascript" src="{{url('/admin_assets')}}/assets/js/script.js"></script>

<script src="https://cdn.ckeditor.com/4.15.0/standard/ckeditor.js"></script>
<script type="text/javascript" src="{{url('/admin_assets')}}/assets/js/toastr.js"></script>
<script type="text/javascript" src="{{url('/admin_assets')}}/assets/js/validate.js"></script>

<script type="text/javascript" src="{{url('/admin_assets')}}/assets/js/prism.js"></script>


<script>
  @if(Session::has('message'))
    var type = "{{ Session::get('alert-type') }}";
    switch(type){
        case 'info':
            toastr.info("{{ Session::get('message') }}");
            break;
        
        case 'warning':
            toastr.warning("{{ Session::get('message') }}");
            break;

        case 'success':
            toastr.success("{{ Session::get('message') }}");
            break;

        case 'error':
            toastr.error("{{ Session::get('message') }}");
            break;
    }
  @endif
</script>

     <script>
  function goBack() {
    window.history.back();
}
</script>

<script type="text/javascript">

   $(function () {
    // Replace the <textarea id="editor1"> with a CKEditor
    // instance, using default configuration.
    CKEDITOR.replace('editor1');
    //CKEDITOR.replace('editor2')
    //bootstrap WYSIHTML5 - text editor
    // $('.textarea').wysihtml5()
  })
</script>

<script>
  function isChar(evt) {

    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
               
    if (iKeyCode != 46 && iKeyCode > 31 && iKeyCode > 32 && (iKeyCode < 65 || iKeyCode > 90)&& (iKeyCode < 97 || iKeyCode > 122))
    {
      return false;
    }
    else if(iKeyCode == 46)
    {
      return false;
    }
    else
    {
     return true;
      
    }

  }

  function isNumber(evt) {
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

    return true;
  }


function changestatus(table,idcolumn,idval,statuscolumn,statusval)
{
  var status=statusval;
  $.ajax({
    headers: {'X-CSRF-Token':'{{csrf_token()}}'},  
    url: '<?=url('adminpanel/changestatus')?>',
    method:'post',
    data:{'table':table,'idcolumn':idcolumn,'id':idval,'statuscolumn':statuscolumn,'status':statusval},
    error:function()
    {
      console.log('error');
    },
    success:function(response)
    {
      var res=response.status;
      if(res=='200'){
      var btnstatus=null;
      var btntext=null;
      var btnclass=null; 
      
  if(status==0)
  {
  btnstatus=1;
  btntext="Inactive";
  btnclass="btn-grd-danger";
  }

  else if(status==1)
  {
  btnstatus=0;
  btntext="Active";
  btnclass="btn-grd-success";
  }
  var fun="return changestatus('"+table+"','"+idcolumn+"',"+idval+",'"+statuscolumn+"',"+btnstatus+");";
  $("#assetsid"+idval).html('<button class="btn waves-effect waves-light hor-grd '+btnclass+' btn-flat"  onclick="'+fun+'">'+btntext+'</button>');
      }
    }
  });
}




function goBack() {
  window.history.back();
}
</script>

@yield('jquerycode')

</body>
<!-- Mirrored from demo.dashboardpack.com/admindek-html/default/dt-advance.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 07 Sep 2020 13:54:48 GMT -->
</html>
