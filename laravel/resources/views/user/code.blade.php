@extends('user.layout.master')
@section('title','Code List')
@section('csscode')
<style>

    .pagination{
      float: right;
    }
    
    .pagination>li>a, .pagination>li>span {
      position: relative;
      float: left;
      padding: 6px 12px;
      margin-left: -1px;
      line-height: 1.42857143;
      color: #337ab7;
      text-decoration: none;
      background-color: #fff;
      border: 1px solid #ddd;
  }
  
  
  .pagination>.active>a, .pagination>.active>a:focus, .pagination>.active>a:hover, .pagination>.active>span, .pagination>.active>span:focus, .pagination>.active>span:hover {
      z-index: 3;
      color: #fff;
      cursor: default;
      background-color: #337ab7;
      border-color: #337ab7;
  }
  
  .pagination>.disabled>a, .pagination>.disabled>a:focus, .pagination>.disabled>a:hover, .pagination>.disabled>span, .pagination>.disabled>span:focus, .pagination>.disabled>span:hover {
      color: #777;
      cursor: not-allowed;
      background-color: #fff;
      border-color: #ddd;
  }
  
  
  .pagination>li>a, .pagination>li>span {
      position: relative;
      float: left;
      padding: 6px 12px;
      margin-left: -1px;
      line-height: 1.42857143;
      color: #337ab7;
      text-decoration: none;
      background-color: #fff;
      border: 1px solid #ddd;
  }
  
  
  </style>
@endsection
@section('content')
     <!-- Breadcrumb Section Begin -->
     <section class="breadcrumb-option">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb__text">
                        <h4>Code Listing</h4>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Breadcrumb Section End -->

    <!-- Shop Section Begin -->
    <section class="shop spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    
                    <div class="shop__sidebar">
                        <button type="button" class="btn btn-primary float-right" style="margin-bottom: 10px; display:none;"  id="btnfilter" onclick="return clearFilter();" >Clear Filter</button>
                        <br><br>
                        <div class="shop__sidebar__accordion">
                            <div class="accordion" id="accordionExample">
                              @foreach($category as $cat)  
                              @php
                                  $it = $loop->iteration;
                              @endphp
                                <div class="card">
                                    <div class="card-heading">
                                        <a data-toggle="collapse" data-target="#collapseOne{{ $loop->iteration }}">{{ $cat->name }}</a>
                                    </div>
                                    <div id="collapseOne{{ $loop->iteration }}" class="collapse" data-parent="#accordionExample">
                                        <div class="card-body">
                                            <div class="shop__sidebar__categories">
                                                <ul class="nice-scroll">
                                                @foreach(getFrontSubCategory($cat->id) as $subcat)    
                                                <li>
                                                    <label class="form-check-label " style="cursor: pointer;">
                                                        <input type="checkbox" class="" name="subcategory[]"
                                                         id="chk{{$it.$loop->iteration}}"
                                                        onclick="addCheck('{{ $it }}','{{$loop->iteration}}'); filterCode('{{ $it }}');"  value="{{$subcat->id}}" / > <span>{{ $subcat->name }}</span>
                                                    </label>
                                                    </li>
                                                @endforeach
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                @endforeach
                              
                      
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9" id="codediv">
                   
                    <div class="row" id="uniqueId">


                    @forelse($codes as $row)
                        <div class="col-lg-4 col-md-6 col-sm-6">
                            <div class="product__item">
                                <div class="product__item__pic set-bg" data-setbg="{{ url('/upload/'.$row->image) }}">
                                    
                                </div>
                                <div class="product__item__text">
                                    <h6><?=$row->title?></h6>
                                    <a href="{{ url('viewcode/'.$row->id) }}" class="add-cart"><i class="fa fa-eye"></i> View Code</a>
                                </div>
                            </div>
                        </div>
                        @empty
                         <span class="text-danger text-center">No Record Found</span>
                        @endforelse
                        
                        </div>
                    </div>

                   
                </div>
            </div>
        </div>
    </section>
    <!-- Shop Section End -->
@endsection

@section('jquerycode')
<script src="{{ asset('/web/js/paginathing.js') }}"></script>
<script>

    function addCheck(mid,sid)
    {
         var cls = `chk${mid}`;
           if($("#chk"+mid+sid).is(":checked"))
           {
              $("#chk"+mid+sid).addClass(cls);
           }
           else{
               $("#chk"+mid+sid).removeClass(cls);
           }
    }//add Check method close

    function filterCode(id)
    {
        $("input[name='subcategory[]'").prop('checked', false); 
        $('.chk'+id).prop('checked',true);
        const len = $("input[name='subcategory[]']:checked").length;
        if(len>0)
        {
           var favorite = []; 
           $.each($("input[name='subcategory[]']:checked"), function(){
              favorite.push($(this).val());
          });
          var subcat_ids = favorite.join(",");
          
        $.ajax({
        url:'{{ url("/filtercodes") }}',
        method:'post',
        data:{'subcat_ids[]':subcat_ids,'_token':'{{ csrf_token() }}','action':'filtercodes'},
        error:function(){
           alert('Error');
        },
        success:function(data){
         $('#btnfilter').show();   
         $('#codediv').html(data);
        },
       });

        }//check lenght close

    }//filterCode method close

    function clearFilter()
    {
        $("input[name='subcategory[]'").prop('checked', false); 
        $("input[name='subcategory[]'").prop('class', ""); 
        $.ajax({
        url:'{{ url("/filtercodes") }}',
        method:'post',
        data:{'_token':'{{ csrf_token() }}','action':'clearfilter'},
        error:function(){
           alert('Error');
        },
        success:function(data){
         $('#btnfilter').hide();   
         $('#codediv').html(data);
        },
       });
    }
    


    function pagination() {
 $('#uniqueId').paginathing({
 // Pagination controls
  perPage: 6,
  limitPagination: false, // or change to limitPagination:3,
  pageNumbers: true,
  prevNext:true,
  firstLast:true,
  prevText:'&laquo;',  // or change to prevText:Previous
  nextText:'&raquo;', // or change to  nextText:Next,
  firstText:'First',
  lastText:'Last',
  containerClass:'',  // or change to  containerClassClassname,
  ulClass:'pagination',
  liClass:'page',
  activeClass:'active',
  disabledClass:'disabled'
    });
  }
</script>
@if(count($codes)>6)
<script>
pagination();
</script>
@endif
@endsection