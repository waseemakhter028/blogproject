@extends('admin.layout.master')
@section('title','Code List')
@section('content')
<div class="pcoded-content">
    <!-- [ breadcrumb ] start -->
    <div class="page-header card">
        <div class="row align-items-end">
            <div class="col-lg-8">
                <div class="page-header-title">
                    <i class="feather icon-inbox bg-c-blue"></i>
                    <div class="d-inline">
                        <h5>Code</h5>
                        <span>Code List</span>
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
                        <li class="breadcrumb-item"><a href="#!">Code List</a>
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
                <h5>Code List</h5>

                <a href="{{ url('adminpanel/code/add') }}">
                 <button type="button" class="btn waves-effect waves-light hor-grd btn-grd-primary pull-right">Add Code</button> 
                </a>

              </div>
              <div class="card-block">
                @if(Session::has('success'))
                       <div class="alert alert-success background-success col-md-10">
                       <strong>Success! </strong> {{ Session::get('success') }}
                       </div>
                 @endif

                <div class="table-responsive dt-responsive">
                  <table id="dom-jqry" class="table table-striped table-bordered nowrap">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Image</th>
                        <th>Category Name</th>
                        <th>Sub Category Name</th>
                        <th>Tiltle</th>
                        <th>Description</th>
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
                        <td>
                         <a href="{{ url('adminpanel/code/edit/'.$id) }}"> <img src="{{ url('/upload/'.$row->image) }}" height="60" width="80" /> </a>
                        </td>
                        <td>{{ $row->mainname }}</td>
                        <td>{{ $row->subname }}</td>
                        <td>{{ $row->title }}</td>
                        <td>
                        <a href="JavaScript:void(0)" id="en{{$loop->iteration}}" onclick="return readMore('en{{$loop->iteration}}');" msg="<?=$row->description?>" >View <i class="fa fa-eye"></i></a>
                        </td>
                        <td id="assetsid{{$id}}">
                          <button type="button" class="btn waves-effect waves-light hor-grd {{ $btnclass }} btn-flat" onclick="return changestatus('codes','id','{{ $id }}','status','{{ $btnstatus }}');">{{ $btntext }}</button></td>
                        <td><a href="{{ url('adminpanel/code/edit/'.$id) }}"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                        &nbsp;&nbsp;
                        <a href="{{  url('adminpanel/code/delete/'.$id)  }}" onclick="return ConfirmDelete('{{ $id }}');">
                         <i class="fa fa-trash" aria-hidden="true"></i></a>
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

<div id="common_modal" class="modal fade common_modal" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header text-white" style="background: #1d2531;">
        
        <h4 class="modal-title">Description</h4>
        <button type="button" class="close float-right text-white" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body" id="commonmodalbody">
      
       </div>
      <div class="modal-footer">
        <button type="button"  data-dismiss="modal" class="btn btn-default btn-flat pull-right text-white" style="background: #1d2531;" >CLOSE</button>
      </div>
    </div>
  </div>
</div>
@endsection

@section('jquerycode')
    <script>
      readMore = (id) => {
        
$('#commonmodalbody').html($('#'+id).attr('msg'));
$('#common_modal').modal('show');
}

ConfirmDelete = () =>
  {
     if(confirm("Are You Sure Delete This Record"))
     {
        return true;
     }
     return false;
  }
    </script>
@endsection