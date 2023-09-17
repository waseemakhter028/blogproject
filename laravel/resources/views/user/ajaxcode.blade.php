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
                        
 <script src="{{ asset('/web/') }}/js/main.js"></script>                       </div>
<script src="{{ asset('/web/js/paginathing.js') }}"></script>


<script>
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