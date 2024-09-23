@extends('admin.layout.master')
@section('content')
<div class="pcoded-content">
    <!-- [ breadcrumb ] start -->
    <div class="page-header card">
      <div class="row align-items-end">
        <div class="col-lg-8">
          <div class="page-header-title">
            <i class="feather icon-home bg-c-blue"></i>
            <div class="d-inline">
              <h5>Dashboard</h5>
              
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="page-header-breadcrumb">
            <ul class=" breadcrumb breadcrumb-title">
              <li class="breadcrumb-item">
                <a href="#!"><i class="feather icon-home"></i> Admin</a>
              </li>
              <li class="breadcrumb-item"><a href="#!">Dashboard</a> </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- [ breadcrumb ] end -->
    <div class="pcoded-inner-content">
      <div class="main-body">
        <div class="page-wrapper">
          <div class="page-body">
            <!-- [ page content ] start -->
            <div class="row">
              <!-- product profit start -->
              <div class="col-xl-4 col-md-6">
                <a href="{{ url('adminpanel/category/list') }}">
                <div class="card prod-p-card card-blue">
                  <div class="card-body">
                    <div class="row align-items-center m-b-30">
                      <div class="col">
                        <h6 class="m-b-5 text-white">Total Categories</h6>
                        <h3 class="m-b-0 f-w-700 text-white">{{ $cat }}</h3>
                      </div>
                      <div class="col-auto">
                        <i class="fa fa-users"></i>
                      </div>
                    </div>
                    <p class="m-b-0 text-white"><span class="label label-primary m-r-10">&nbsp;</span>&nbsp;</p>
                  </div>
                </div>
               </a>
              </div>
              
              <div class="col-xl-4 col-md-6">
                <a href="{{ url('adminpanel/subcategory/list') }}">
                <div class="card prod-p-card card-green">
                  <div class="card-body">
                    <div class="row align-items-center m-b-30">
                      <div class="col">
                        <h6 class="m-b-5 text-white">Total Sub Categories</h6>
                        <h3 class="m-b-0 f-w-700 text-white">{{ $subcat }}</h3>
                      </div>
                      <div class="col-auto">
                       <i class="fa fa-users"></i>
                      </div>
                    </div>
                    <p class="m-b-0 text-white"><span class="label label-success m-r-10">&nbsp;</span>&nbsp;</p>
                  </div>
                </div>
               </a>
              </div>
  
              <div class="col-xl-4 col-md-6">
                <a href="{{ url('adminpanel/code/list') }}">
                <div class="card prod-p-card card-red">
                  <div class="card-body">
                    <div class="row align-items-center m-b-30">
                      <div class="col">
                        <h6 class="m-b-5 text-white">Total Codes</h6>
                        <h3 class="m-b-0 f-w-700 text-white">{{ $code }}</h3>
                      </div>
                      <div class="col-auto">
                       <i class="fa fa-users"></i>
                      </div>
                    </div>
                     <p class="m-b-0 text-white"><span class="label label-danger m-r-10">&nbsp;</span>&nbsp;</p>
                  </div>
                </div>
              </a>
              </div>
  
             
              <!-- product profit end -->
          
                <div class="table-responsive dt-responsive">
                <h4 class="text-center text-primary mb-10">Latest Categories</h4>
                                 <table id="dom-jqry" class="table table-striped table-bordered nowrap">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Created On</t>
                  </tr>
                </thead>
                <tbody>
                  @foreach($latest_cat as $row)
                  <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $row->name }}</td>
                    <td>{{ \App\Services\HelperService::dtf($row->created_at) }}</td>
                  </tr>
                  @endforeach
                  
                </tbody>
                
              </table>
                              </div>
              
             
            </div>
            <!-- [ page content ] end -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- [ style Customizer ] start -->
  <div id="styleSelector">
  </div>
  <!-- [ style Customizer ] end -->
  </div>
  </div>
  </div>
  </div>
@endsection