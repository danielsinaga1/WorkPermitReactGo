<?php

namespace App\Http\Controllers;

use App\Models\EventFestival;
use Illuminate\Http\Request;

class EventFestivalController extends Controller
{
    /**
     * Daftar event & festival (publik)
     */
    public function index(Request $request)
    {
        $query = EventFestival::published();

        if ($request->has('search')) {
            $query->search($request->input('search'));
        }

        if ($request->has('kategori')) {
            $query->byKategori($request->input('kategori'));
        }

        if ($request->has('upcoming') && $request->input('upcoming') == '1') {
            $query->upcoming();
        }

        $perPage = $request->input('per_page', 12);
        $events = $query->orderBy('tanggal_mulai', 'desc')->paginate($perPage);

        return $this->paginatedResponse($events);
    }

    /**
     * Detail event/festival (publik)
     */
    public function show($id)
    {
        $event = EventFestival::find($id);

        if (!$event) {
            return $this->notFoundResponse('Event tidak ditemukan');
        }

        return $this->successResponse($event);
    }
}
