<?php

namespace App\Http\Controllers;

use App\Models\Code;
use App\Models\SubCategory;
use Illuminate\Http\Request;


class CodeController extends Controller
{
    protected function code()
    {
        $data = Code::select('codes.*', 't1.name as subname', 't2.name as mainname')
            ->join('sub_categories as t1', 't1.id', '=', 'codes.sub_category_id')
            ->join('categories as t2', 't2.id', '=', 't1.category_id')->orderBy('codes.id', 'DESC')->paginate(10);
        return view('admin.code.list',  compact('data'));
    } //category method close

    protected function codeAdd(Request $request)
    {
        if ($request->isMethod("POST")) {
            # Validation Logic
            $rules = [
                'title'              => 'required|max:200',
                'image'              => 'required|max:2000',
                'category'           => 'required',
                'sub_category'        => 'required',
                'description'        => 'required',
                'language'           => 'required',
            ];
            $messages = [
                'required'        => 'Please Select :attribute',
                'title.required' => 'Please Enter :attribute',
                'description.required' => 'Please Enter :attribute',
                'language.required' => 'Please Enter :attribute',
            ];

            $this->validate($request, $rules, $messages);
            $code = new Code;
            if ($request->hasFile('image')) {
               
                $image = $request->file('image');
                $imageContents = file_get_contents($image->getRealPath());
                $code->image = base64_encode($imageContents);
            }
            $code->title = strip_tags($request->title);
            $code->description = htmlspecialchars($request->description);
            $code->sub_category_id = $request->sub_category;
            $code->language = $request->language;
            $save_status = $code->save();


            if ($save_status) {
                return redirect('adminpanel/code/add')->with('success', 'Code Added Successfully');
            }
        } //method check if close
        else {
            return view('admin.code.add');
        }
    } //code add method close

    protected function codeEdit($id = null, Request $request)
    {
        if ($request->isMethod("POST")) {
            $rules = [
                'title'              => 'required|max:200',
                'image'              => 'max:2000',
                'category'           => 'required',
                'sub_category'        => 'required',
                'description'        => 'required',
                'language'           => 'required',
            ];
            $messages = [
                'required'        => 'Please Select :attribute',
                'title.required' => 'Please Enter :attribute',
                'description.required' => 'Please Enter :attribute',
                'language.required' => 'Please Enter :attribute',
            ];

            $this->validate($request, $rules, $messages);
            $code = Code::findOrFail($request->id);

            if ($request->hasFile('image')) {

                $image = $request->file('image');
                $imageContents = file_get_contents($image->getRealPath());
                $code->image = base64_encode($imageContents);

            }
            $code->title = strip_tags($request->title);
            $code->description = htmlspecialchars($request->description);
            $code->sub_category_id = $request->sub_category;
            $code->language = $request->language;
            $save_status = $code->save();
            if ($save_status) {
                return redirect('adminpanel/code/edit/' . $request->id)->with('success', 'Code Details Updated Successfully');
            }
        } //method check if close
        else {
            $data = Code::findOrFail($id);
            $main =  SubCategory::find($data->sub_category_id);
            $mainid = $main->category_id;
            return view('admin.code.edit')->withrow($data)->withmainid($mainid);
        }
    } //codeedit method close

    protected function codeDelete($id = null)
    {
        $code = Code::findOrFail($id);

        $save_status = $code->delete();
        if ($save_status) {
            return redirect('adminpanel/code/list')->with('success', 'Code Details Deleted Successfully');
        }
    } //codeDelete method close

    protected function subcategory(Request $request)
    {
        return SubCategory::where('category_id', $request->id)->select('name', 'id')->orderBy('name', 'ASC')->get();
    } //get sub category  method close

}
