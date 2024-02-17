@extends('admin.layout.master')
@section('title','Edit Code')
@section('content')
<div class="pcoded-content">
    <!-- [ breadcrumb ] start -->
    <div class="page-header card">
      <div class="row align-items-end">
        <div class="col-lg-8">
          <div class="page-header-title">
            <i class="feather icon-clipboard bg-c-blue"></i>
            <div class="d-inline">
              <h5>Edit Code</h5>
              <span></span>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="page-header-breadcrumb">
            <ul class=" breadcrumb breadcrumb-title">
              <li class="breadcrumb-item">
                <a href="#!"><i class="feather icon-home"></i></a>
              </li>
              <li class="breadcrumb-item"><a href="#!">Admin</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#!">Add Code</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- [ breadcrumb ] end -->
  <div class="pcoded-inner-content">
    <!-- Main-body start -->
    <div class="main-body">
      <div class="page-wrapper">
        <!-- Page body start -->
        <div class="page-body">
          <div class="row">
            <div class="col-sm-12">
              <!-- Basic Form Inputs card start -->
              <div class="card">
                <div class="card-header">
                  <h5>Edit Code Details</h5>
                  <a href="{{ url('adminpanel/code/list') }}">
                               <button type="button" class="btn waves-effect waves-light hor-grd btn-grd-primary pull-right">Back</button> 
                </a>
                </div>
                <div class="card-block">
                    @if(Session::has('success'))
                       <div class="alert alert-success background-success col-md-10">
                       <strong>Success! </strong> {{ Session::get('success') }}
                       </div>
                    @endif
                   <form method="post"  action="" autocomplete="off" enctype="multipart/form-data" novalidate="novalidate" id="NewForm">
                   @csrf

                   <input type="hidden" name="id" value="{{ $row->id }}" />

                   <img src="{{ url('/upload/'.$row->image) }}" alt="" class="" id="output" height="160" width="200">
										<div class="form-group row" id="div_image">
											<label for="newstitle" class="col-sm-2 col-form-label">Image</label>
											<div class="col-sm-8">
                        <input type="file" id="banner_image" name="image" class="form-control" accept=".jpg,.jpeg,.png" onchange="imgDim();validImage();">
                        <span class="text-danger">
                          @error('image')
                          {{ $message }}
                         @enderror
                        </span>
                        <span id="sp_img" class="text-danger"></span>
                        
											</div>
                    </div>

                    <div class="form-group row">
                      <label class="col-sm-2 col-form-label">Select Category*</label>
                      <div class="col-sm-8">
                        <select name="category" class="form-control" onchange="return getSubCategory(this.value)">
                          <option value="">Select Catgory</option>
                          @foreach(getCategory() as $cat)
                          <option value="{{ $cat->id }}" {{ ($mainid==$cat->id) ? 'selected=""' :null }}>{{ $cat->name }}</option>
                          @endforeach
                        </select>
                        <span class="text-danger">
                          @error('category')
                          {{ $message }}
                         @enderror
                        </span>
                      </div>
                    </div>
  
                    
                    <div class="form-group row">
                      <label class="col-sm-2 col-form-label">Select Sub Category*</label>
                      <div class="col-sm-8">
                        <select name="sub_category" id="subcategory" class="form-control">
                          <option value="">Select Sub Catgory</option>
                          @foreach(getSubCategory($mainid) as $scat)
                          <option value="{{ $scat->id }}" {{ ($row->sub_category_id==$scat->id) ? 'selected=""' :null }}>{{ $scat->name }}</option>
                          @endforeach
                        </select>
                        <span class="text-danger">
                          @error('sub_category')
                          {{ $message }}
                         @enderror
                        </span>
                      </div>
                    </div>

                    <div class="form-group row">
                      <label class="col-sm-2 col-form-label">Language*</label>
                      <div class="col-sm-8">
                       <input type="text" name="language" placeholder="Please Enter Language*" value="{{ $row->language }}" class="form-control" />
                        <span class="text-danger">
                          @error('language')
                          {{ $message }}
                         @enderror
                        </span>
                      </div>
                    </div>

                    
                    <div class="form-group row">
                      <label class="col-sm-2 col-form-label">Title*</label>
                      <div class="col-sm-8">
                        <textarea placeholder="Please Enter Title*" name="title" class="form-control" >{{ $row->title }}</textarea>
                        <span class="text-danger">
                          @error('title')
                          {{ $message }}
                         @enderror
                        </span>
                      </div>
                    </div>

                    <div class="form-group row">
                      <label class="col-sm-2 col-form-label">Description*</label>
                      <div class="col-sm-8">
                        <textarea name="description" class="form-control" id="editor14" placeholder="Please Enter Description*" rows="20"><?=$row->description?></textarea>
                        <span class="text-danger">
                          @error('description')
                          {{ $message }}
                         @enderror
                        </span>
                      </div>
                    </div>
  
                    
                  
  
  
                    <div class="form-group row">
                        <label for="newstitle" class="col-sm-2 col-form-label">&nbsp;</label>
                        <div class="col-sm-10">
                           <span id="errormsg"></span>
                        </div>
                      </div>
  
  
                      <div class="col-sm-12 col-md-12 col-xs-12">
                        <div class="form-group">
                          <a href="{{ url('adminpanel/code/list') }}" class="btn waves-effect waves-light hor-grd btn-grd-danger text-white">Go Back</a>
                           &nbsp;&nbsp;
  
                          <input type="submit" class="btn waves-effect waves-light hor-grd btn-grd-success submitb" value="Update">
                        </div>
                      </div>
                    
                    
                      </form>
                    </div>
                  </div>
  
                  
            </div>
          </div>
        </div>
        <!-- Page body end -->
      </div>
    </div>
    <!-- Main-body end -->
    <div id="styleSelector">
    </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
@endsection

@section('jquerycode')
    <script>
      function validImage()
  {
  	$('#banner_image-error').html(' ');
    var ext = $('#banner_image').val().split('.').pop().toLowerCase();
    var size = parseFloat($("#banner_image")[0].files[0].size / 1024).toFixed(2);  
    if($.inArray(ext, ['png','jpg','jpeg','mp4','3gp','vob']) == -1) {
    $('#sp_img').text('Only jpg, jpeg, png files types are allowed'); 
    $("#banner_image").val('');
    $("#banner_image").focus();
     return false;
   }
   else if(size > 20000){
    $('#sp_img').text('File size should be less than 2 MB.');
    $("#banner_image").val('');
    $("#banner_image").focus();
    }
   else{
    $('#sp_img').text(''); 
    return true;
   }
  }


var dimension=null;
  var size=null;
function imgDim(){
      //Get reference of FileUpload.
    var fileUpload = document.getElementById("banner_image");
      size= fileUpload.files[0].size;
    //Check whether the file is valid Image.
    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.gif)$");
    if (regex.test(fileUpload.value.toLowerCase())) {
 
        //Check whether HTML5 is supported.
        if (typeof (fileUpload.files) != "undefined") {
            //Initiate the FileReader object.
            var reader = new FileReader();
            //Read the contents of Image File.
            reader.readAsDataURL(fileUpload.files[0]);
            reader.onload = function (e) {
                //Initiate the JavaScript Image object.
        var output = document.getElementById('output');
      output.src = reader.result;

      if(output.src!="")
      {
         output.height="160";
         output.width="220";

       }

                var image = new Image();
                
                //Set the Base64 string return from FileReader as source.
                image.src = e.target.result;
                       
                //Validate the File Height and Width.
                image.onload = function () {
                 
                  dimension= [this.height,this.width] ;
                 // dimension= this.width ;
                  //dimension['width']  = {"width": this.width };

                    // dimension['height'] = this.height;
                    // dimension['width'] = this.width;
                };
 
            }
        } 
    } 

   // return dimension;
  }

  getSubCategory = (id) =>
  {
    if(id!=""){    
     $.ajax({
       headers: {'X-CSRF-Token':'{{csrf_token()}}'}, 
       url: "{{ url('adminpanel/code/subcategory') }}",
       method: "post",
       data: {'id':id},
       success: function (res) {

        let option=`<option value="">Select Sub Category</option>`;
   
         res.map(function(cat) {
          option+=`<option value="${cat.id}">${cat.name}</option>`;
            })

          $('#subcategory').html(option);
       }
     });
    }
  }

    </script>
@endsection