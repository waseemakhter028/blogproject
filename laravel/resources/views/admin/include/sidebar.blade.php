<?php
        $url = Request::segment(2);
        $url2 = Request::segment(3);
        $lasturl=last(Request::segments());
        
?>
<div class="pcoded-main-container">
            <div class="pcoded-wrapper">
              <!-- [ navigation menu ] start -->
              <nav class="pcoded-navbar">

                <div class="nav-list">
                  <div class="pcoded-inner-navbar main-menu">
                    <div class="pcoded-navigation-label">WSBLog Admin</div>
                    <ul class="pcoded-item pcoded-left-item">
                      
                      <li class="{{ ($url=='dashboard')  ? 'active' : null }}">
                        <a href="{{ url('adminpanel/dashboard') }}" class="waves-effect waves-dark">
                          <span class="pcoded-micon">
                            <i class="fa fa-dashboard"></i>
                          </span>
                          <span class="pcoded-mtext">Dashboard</span>
                        </a>
                      </li>

                      <li class="{{ ($url=='category')  ? 'active' : null }}">
                        <a href="{{ url('adminpanel/category/list') }}" class="waves-effect waves-dark">
                          <span class="pcoded-micon">
                            <i class="fa fa-tag"></i>
                          </span>
                          <span class="pcoded-mtext">Manage Categories</span>
                        </a>
                      </li>
                     
                      <li class="{{ ($url=='subcategory')  ? 'active' : null }}">
                        <a href="{{ url('adminpanel/subcategory/list') }}" class="waves-effect waves-dark">
                          <span class="pcoded-micon">
                            <i class="fa fa-tag"></i>
                          </span>
                          <span class="pcoded-mtext">Manage Sub Categories</span>
                        </a>
                      </li>

                      <li class="{{ ($url=='code')  ? 'active' : null }}">
                        <a href="{{ url('adminpanel/code/list') }}" class="waves-effect waves-dark">
                          <span class="pcoded-micon">
                            <i class="fa fa-tag"></i>
                          </span>
                          <span class="pcoded-mtext">Manage Codes</span>
                        </a>
                      </li>

                       

                    </ul>
                  </div>
                </div>
              </nav>
              <!-- [ navigation menu ] end -->