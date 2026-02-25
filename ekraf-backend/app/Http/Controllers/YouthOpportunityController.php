<?php

namespace App\Http\Controllers;

use App\Models\YouthOpportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class YouthOpportunityController extends Controller
{
    /**
     * Public listing — published opportunities.
     */
    public function index(Request $request)
    {
        $query = YouthOpportunity::published()
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        if ($request->has('jenis') && $request->jenis) {
            $query->byJenis($request->jenis);
        }

        if ($request->boolean('active_only', false)) {
            $query->active();
        }

        $perPage = $request->get('per_page', 10);

        return $this->paginatedResponse($query->paginate($perPage));
    }

    /**
     * Show single opportunity.
     */
    public function show($id)
    {
        $item = YouthOpportunity::find($id);

        if (!$item) {
            return $this->notFoundResponse('Data tidak ditemukan!');
        }

        return $this->successResponse($item);
    }
}
