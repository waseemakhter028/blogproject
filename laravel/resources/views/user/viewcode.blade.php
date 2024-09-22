@extends('user.layout.master')
@section('title','Code View')
@section('content')

    <!-- Shop Details Section Begin -->
    <section class="shop-details">
        <div class="product__details__pic">
            <div class="container">
                <div class="row">
                <div class="col-lg-12 col-md-12  col-sm-12">
                <img src="data:image/jpeg;base64,{{ $row->image}}"  style="width:50%;" class="img-fluid"  />
                <br/>
                
                </div>
                <a href="{{ url('/') }}" class="btn btn-danger">Back</a>
                </div>
            </div>
        </div>
        <div class="product__details__content">
            <div class="container">
                <div class="row d-flex justify-content-center">
                    <div class="col-lg-8">
                        <div class="product__details__text">
                            <h4 class="text-info"><?=$row->title?></h4>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="product__details__tab">
                            
                            <div class="tab-content">
                                <div class="tab-pane active" id="tabs-5" role="tabpanel">
                                    <div class="product__details__tab__content">
                                      
                                           <pre>
                                               <code class="language-<?=$row->language?>">
                                                <?php echo $row->description; ?>
                                               </code>
                                           </pre>
                                          
                                        </div>
                                    </div>
                                </div>
                              
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Shop Details Section End -->

    <!-- Related Section Begin -->
    <section class="related spad">
       
    </section>
    <!-- Related Section End -->
@endsection