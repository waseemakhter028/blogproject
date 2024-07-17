@extends('admin.layout.master')
@section('title','Category List')
@section('content')
<div class="pcoded-content">
    <!-- [ breadcrumb ] start -->
    <div class="page-header card">
        <div class="row align-items-end">
            <div class="col-lg-8">
                <div class="page-header-title">
                    <i class="feather icon-inbox bg-c-blue"></i>
                    <div class="d-inline">
                        <h5>Category</h5>
                        <span>Category List</span>
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
                        <li class="breadcrumb-item"><a href="#!">Category List</a>
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
          <!-- Page-body start -->
          <div class="page-body">
            <!-- DOM/Jquery table start -->
            <div class="card">
              <div class="card-header">
                <h5>Category List</h5>

                <a href="{{ url('adminpanel/category/add') }}">
                 <button type="button" class="btn waves-effect waves-light hor-grd btn-grd-primary pull-right">Add Category</button> 
                </a>

              </div>
              <div class="card-block">
                <div class="table-responsive dt-responsive">
                  <table id="dom-jqry" class="table table-striped table-bordered nowrap">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>Created On</th>
                      </tr>
                    </thead>
                    <tbody>
                    @foreach($data as $row) 
                    @php
                      $id=$row->id;
                      $btntext=($row->status=='1') ? 'Active' : 'Inactive';
                      $btnclass=($row->status=='1') ? 'btn-grd-success' : 'btn-grd-danger';
                      $btnstatus=($row->status=='1') ? 0 : 1;
                      @endphp

                      <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ $row->name }}</td>
                        <td id="assetsid{{$id}}">
                          <button type="button" class="btn waves-effect waves-light hor-grd {{ $btnclass }} btn-flat" onclick="return changestatus('categories','id','{{ $id }}','status','{{ $btnstatus }}');">{{ $btntext }}</button></td>
                        <td><a href="{{ url('adminpanel/category/edit/'.$id) }}"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                        &nbsp;&nbsp;
                        {{-- <a href="#" onclick="return ConfirmDelete('{{ $id }}');">
                         <i class="fa fa-trash" aria-hidden="true"></i></a> --}}
                        </td>  
                        <td>{{ dtf($row->created_at) }}</td>
                      </tr>
                    @endforeach
                      
                    </tbody>
            
                  </table>
                </div>
              </div>
            </div>
            
            </div>
            <!-- Row Created Callback table end -->
          </div>
          <!-- Page-body start -->
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