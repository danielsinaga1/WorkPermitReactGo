<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

$router->get('/', function () use ($router) {
    return response()->json([
        'name' => 'Work Permit & HSE API',
        'version' => '1.0.0',
        'framework' => $router->app->version(),
        'message' => 'Work Permit & HSE Management System API'
    ]);
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

$router->group(['prefix' => 'api'], function () use ($router) {

    // =====================
    // AUTH ROUTES
    // =====================
    $router->group(['prefix' => 'auth'], function () use ($router) {
        $router->post('login', 'AuthController@login');
        $router->post('register', 'AuthController@register');
        $router->post('logout', 'AuthController@logout');
        $router->get('me', 'AuthController@me');
        $router->post('refresh', 'AuthController@refresh');
        $router->put('change-password', 'AuthController@changePassword');
        $router->put('profile', 'AuthController@updateProfile');
    });

    // =====================
    // UPLOAD ROUTES
    // =====================
    $router->group(['prefix' => 'upload'], function () use ($router) {
        $router->post('/image', 'UploadController@uploadImage');
        $router->post('/pdf', 'UploadController@uploadPdf');
        $router->delete('/{filename}', 'UploadController@delete');
    });

    // ================================================================
    // ================================================================
    //  WORK PERMIT & HSE SYSTEM ROUTES
    // ================================================================
    // ================================================================

    // ========================================
    // PUBLIC / READ-ONLY RESOURCES
    // ========================================
    $router->group(['prefix' => 'wp'], function () use ($router) {

        // Permit Types (publik)
        $router->get('/permit-types', 'ResourceController@indexPermitTypes');
        $router->get('/permit-types/{id}', 'ResourceController@showPermitType');

        // Work Areas (publik)
        $router->get('/work-areas', 'ResourceController@indexAreas');
        $router->get('/work-areas/{id}', 'ResourceController@showArea');
    });

    // ========================================
    // AUTHENTICATED WP & HSE ROUTES
    // ========================================
    $router->group(['prefix' => 'wp', 'middleware' => 'auth:api'], function () use ($router) {

        // =====================
        // WORK PERMITS
        // =====================
        $router->group(['prefix' => 'permits'], function () use ($router) {
            $router->get('/', 'WorkPermitController@index');
            $router->get('/{id}', 'WorkPermitController@show');
            $router->post('/', 'WorkPermitController@store');
            $router->put('/{id}', 'WorkPermitController@update');
            $router->post('/{id}/submit', 'WorkPermitController@submit');
            $router->post('/{id}/approval', 'WorkPermitController@processApproval');
            $router->post('/{id}/activate', 'WorkPermitController@activate');
            $router->post('/{id}/close', 'WorkPermitController@close');
            $router->post('/{id}/risk-assessment', 'WorkPermitController@addRiskAssessment');
            $router->get('/{id}/clash-check', 'WorkPermitController@checkClash');
        });

        // =====================
        // PERSONNEL MANAGEMENT
        // =====================
        $router->group(['prefix' => 'personnel'], function () use ($router) {
            $router->get('/', 'ResourceController@indexPersonnel');
            $router->get('/{id}', 'ResourceController@showPersonnel');
            $router->post('/', 'ResourceController@storePersonnel');
            $router->put('/{id}', 'ResourceController@updatePersonnel');
            $router->post('/{id}/qualification', 'ResourceController@addQualification');
            $router->post('/scan-qr', 'ResourceController@scanPersonnelQr');
            $router->post('/scan-nfc', 'ResourceController@scanPersonnelNfc');
        });

        // =====================
        // EQUIPMENT MANAGEMENT
        // =====================
        $router->group(['prefix' => 'equipment'], function () use ($router) {
            $router->get('/', 'ResourceController@indexEquipment');
            $router->get('/{id}', 'ResourceController@showEquipment');
            $router->post('/', 'ResourceController@storeEquipment');
            $router->put('/{id}', 'ResourceController@updateEquipment');
            $router->post('/{id}/certification', 'ResourceController@addCertification');
        });

        // =====================
        // WORK AREAS (Admin CRUD)
        // =====================
        $router->post('/work-areas', 'ResourceController@storeArea');
        $router->put('/work-areas/{id}', 'ResourceController@updateArea');
        $router->delete('/work-areas/{id}', 'ResourceController@destroyArea');

        // =====================
        // PERMIT TYPES (Admin CRUD)
        // =====================
        $router->post('/permit-types', 'ResourceController@storePermitType');
        $router->put('/permit-types/{id}', 'ResourceController@updatePermitType');

        // =====================
        // HSE: TOOLBOX MEETINGS
        // =====================
        $router->group(['prefix' => 'toolbox'], function () use ($router) {
            $router->get('/', 'HseController@indexToolbox');
            $router->get('/{id}', 'HseController@showToolbox');
            $router->post('/', 'HseController@storeToolbox');
            $router->put('/{id}', 'HseController@updateToolbox');
            $router->post('/{id}/complete', 'HseController@completeToolbox');
        });

        // =====================
        // HSE: SAFETY OBSERVATIONS
        // =====================
        $router->group(['prefix' => 'observations'], function () use ($router) {
            $router->get('/', 'HseController@indexObservations');
            $router->get('/{id}', 'HseController@showObservation');
            $router->post('/', 'HseController@storeObservation');
            $router->post('/{id}/photo', 'HseController@addObservationPhoto');
            $router->post('/{id}/corrective-action', 'HseController@assignCorrectiveAction');
        });

        // =====================
        // HSE: CORRECTIVE ACTIONS
        // =====================
        $router->group(['prefix' => 'corrective-actions'], function () use ($router) {
            $router->get('/', 'HseController@indexCorrectiveActions');
            $router->post('/{id}/complete', 'HseController@completeCorrectiveAction');
        });

        // =====================
        // HSE: INCIDENTS & NEAR-MISS
        // =====================
        $router->group(['prefix' => 'incidents'], function () use ($router) {
            $router->get('/', 'HseController@indexIncidents');
            $router->get('/{id}', 'HseController@showIncident');
            $router->post('/', 'HseController@storeIncident');
            $router->put('/{id}', 'HseController@updateIncident');
            $router->post('/{id}/root-cause', 'HseController@addRootCause');
            $router->post('/{id}/close', 'HseController@closeIncident');
        });

        // =====================
        // LOTO (Lock Out Tag Out)
        // =====================
        $router->group(['prefix' => 'loto'], function () use ($router) {
            $router->get('/', 'LotoController@index');
            $router->get('/{id}', 'LotoController@show');
            $router->post('/', 'LotoController@store');
            $router->put('/{id}', 'LotoController@update');
            $router->post('/{id}/lock', 'LotoController@applyLock');
            $router->post('/{id}/lock/{lockId}/remove', 'LotoController@removeLock');
            $router->post('/{id}/verify', 'LotoController@verify');
            $router->post('/scan-qr', 'LotoController@scanQr');
            $router->post('/scan-nfc', 'LotoController@scanNfc');
        });

        // =====================
        // DASHBOARD & ANALYTICS
        // =====================
        $router->group(['prefix' => 'dashboard'], function () use ($router) {
            $router->get('/overview', 'HseDashboardController@overview');
            $router->get('/leading-indicators', 'HseDashboardController@leadingIndicators');
            $router->get('/trends', 'HseDashboardController@trendAnalytics');
            $router->post('/export', 'HseDashboardController@exportReport');
            $router->get('/export/{id}/status', 'HseDashboardController@exportStatus');
        });

        // =====================
        // GAS TESTING (#12)
        // =====================
        $router->get('/permits/{id}/gas-tests', 'ExtendedHseController@indexGasTests');
        $router->post('/permits/{id}/gas-tests', 'ExtendedHseController@storeGasTest');

        // =====================
        // EMERGENCY SOS (#16)
        // =====================
        $router->group(['prefix' => 'sos'], function () use ($router) {
            $router->post('/', 'ExtendedHseController@triggerSos');
            $router->get('/', 'ExtendedHseController@indexSosAlerts');
            $router->post('/{id}/acknowledge', 'ExtendedHseController@acknowledgeSos');
            $router->post('/{id}/resolve', 'ExtendedHseController@resolveSos');
        });

        // =====================
        // LESSONS LEARNED (#20)
        // =====================
        $router->group(['prefix' => 'lessons'], function () use ($router) {
            $router->get('/', 'ExtendedHseController@indexLessons');
            $router->post('/', 'ExtendedHseController@storeLesson');
            $router->get('/permits/{id}/mandatory', 'ExtendedHseController@mandatoryLessons');
            $router->post('/{id}/acknowledge', 'ExtendedHseController@acknowledgLesson');
        });

        // =====================
        // E-SIGNATURE (#6)
        // =====================
        $router->post('/e-signature', 'ExtendedHseController@storeSignature');

        // =====================
        // JSA — JOB SAFETY ANALYSIS (#1)
        // =====================
        $router->group(['prefix' => 'jsa'], function () use ($router) {
            $router->get('/templates', 'ExtendedHseController@indexJsaTemplates');
            $router->get('/permits/{id}', 'ExtendedHseController@getOrCreateJsa');
            $router->put('/permits/{id}', 'ExtendedHseController@updateJsa');
        });

        // =====================
        // CONTRACTOR MANAGEMENT (#14)
        // =====================
        $router->group(['prefix' => 'contractors'], function () use ($router) {
            $router->get('/', 'ExtendedHseController@indexContractors');
            $router->post('/', 'ExtendedHseController@storeContractor');
            $router->put('/{id}', 'ExtendedHseController@updateContractor');
        });

        // =====================
        // PERMIT PHOTOS (#9)
        // =====================
        $router->get('/permits/{id}/photos', 'ExtendedHseController@indexPermitPhotos');
        $router->post('/permits/{id}/photos', 'ExtendedHseController@storePermitPhoto');

        // =====================
        // GEOFENCE VALIDATION (#3)
        // =====================
        $router->post('/permits/{id}/geofence', 'ExtendedHseController@validateGeofence');

        // =====================
        // NOTIFICATIONS (#5)
        // =====================
        $router->group(['prefix' => 'notifications'], function () use ($router) {
            $router->get('/', 'ExtendedHseController@indexNotifications');
            $router->post('/{id}/read', 'ExtendedHseController@markNotificationRead');
        });

        // =====================
        // AUDIT TRAIL
        // =====================
        $router->get('/audit-trails', 'ExtendedHseController@indexAuditTrails');

        // =====================
        // QR CODE VERIFICATION (#4)
        // =====================
        $router->post('/qr-verify', 'ExtendedHseController@verifyPermitQr');

        // =====================
        // ENHANCED PERMIT WORKFLOW (V2)
        // =====================
        $router->post('/permits/{id}/submit-v2', 'ExtendedHseController@submitPermitV2');
        $router->post('/permits/{id}/activate-v2', 'ExtendedHseController@activatePermitV2');
        $router->post('/permits/{id}/close-v2', 'ExtendedHseController@closePermitV2');

        // =====================
        // PPE CHECKLISTS
        // =====================
        $router->get('/permits/{id}/ppe-checklists', 'GapFeaturesController@indexPpeChecklists');
        $router->post('/permits/{id}/ppe-checklists', 'GapFeaturesController@storePpeChecklist');

        // =====================
        // PERMIT TRANSFER
        // =====================
        $router->get('/permits/{id}/transfers', 'GapFeaturesController@indexTransfers');
        $router->post('/permits/{id}/transfer', 'GapFeaturesController@requestTransfer');
        $router->post('/transfers/{id}/process', 'GapFeaturesController@processTransfer');

        // =====================
        // PERMIT REVOKE
        // =====================
        $router->post('/permits/{id}/revoke', 'GapFeaturesController@revokePermit');

        // =====================
        // CLOSURE CHECKLIST
        // =====================
        $router->get('/permits/{id}/closure-checklist', 'GapFeaturesController@getClosureChecklist');
        $router->post('/permits/{id}/closure-checklist', 'GapFeaturesController@storeClosureChecklist');

        // =====================
        // FORM FIELD CONFIGURATION (No-Code Builder)
        // =====================
        $router->get('/field-configs', 'GapFeaturesController@indexFieldConfigs');
        $router->post('/field-configs', 'GapFeaturesController@storeFieldConfig');
        $router->put('/field-configs/{id}', 'GapFeaturesController@updateFieldConfig');
        $router->delete('/field-configs/{id}', 'GapFeaturesController@destroyFieldConfig');

        // ================================================================
        // ARSHE GAP CLOSURE: KPI / DASHBOARD ENHANCEMENTS
        // ================================================================
        $router->group(['prefix' => 'kpi'], function () use ($router) {
            $router->get('/metrics', 'HseKpiController@indexMetrics');
            $router->post('/metrics', 'HseKpiController@storeMetric');
            $router->put('/metrics/{id}', 'HseKpiController@updateMetric');

            $router->get('/manhours', 'HseKpiController@indexManhours');
            $router->post('/manhours', 'HseKpiController@storeManhours');

            $router->get('/compute', 'HseKpiController@computeKpi');
            $router->post('/snapshot', 'HseKpiController@saveKpiSnapshot');
            $router->get('/trends', 'HseKpiController@trends');
            $router->get('/export', 'HseKpiController@exportKpi');

            // ArSHE-parity: compliance + overall + incident-by-class
            $router->get('/compliance', 'HseKpiController@complianceMetrics');
            $router->get('/overall', 'HseKpiController@overallScore');
            $router->get('/incident-by-class', 'HseKpiController@incidentByClass');
        });

        // Dashboard: activity feed + recent docs
        $router->get('/dashboard/activity-feed', 'HseDashboardController@activityFeed');
        $router->get('/dashboard/recent-documents', 'HseDashboardController@recentDocuments');

        // ================================================================
        // ARSHE GAP CLOSURE: B-SHARP (Behavior Based Safety)
        // ================================================================
        $router->group(['prefix' => 'bsharp'], function () use ($router) {
            $router->get('/', 'BSharpController@index');
            $router->get('/summary', 'BSharpController@summary');
            $router->get('/{id}', 'BSharpController@show');
            $router->post('/', 'BSharpController@store');
            $router->put('/{id}', 'BSharpController@update');
            $router->post('/{id}/complete', 'BSharpController@complete');
            $router->delete('/{id}', 'BSharpController@destroy');
        });

        // ================================================================
        // ARSHE GAP CLOSURE: AUDIT MODULE
        // ================================================================
        $router->group(['prefix' => 'audits'], function () use ($router) {
            $router->get('/', 'AuditController@index');
            $router->get('/summary', 'AuditController@summary');
            $router->get('/{id}', 'AuditController@show');
            $router->post('/', 'AuditController@store');
            $router->put('/{id}', 'AuditController@update');
            $router->post('/{id}/close', 'AuditController@close');
            $router->delete('/{id}', 'AuditController@destroy');

            $router->get('/{id}/findings', 'AuditController@indexFindings');
            $router->post('/{id}/findings', 'AuditController@storeFinding');
        });
        $router->put('/audit-findings/{id}', 'AuditController@updateFinding');

        // ================================================================
        // ARSHE GAP CLOSURE: DOCUMENT REPOSITORY
        // ================================================================
        $router->group(['prefix' => 'documents'], function () use ($router) {
            $router->get('/', 'DocumentController@index');
            $router->get('/categories', 'DocumentController@categories');
            $router->get('/{id}', 'DocumentController@show');
            $router->post('/', 'DocumentController@store');
            $router->put('/{id}', 'DocumentController@update');
            $router->delete('/{id}', 'DocumentController@destroy');
            $router->post('/{id}/download', 'DocumentController@download');
        });

        // ================================================================
        // ARSHE GAP CLOSURE: BALANCED SCORECARD
        // ================================================================
        $router->group(['prefix' => 'scorecard'], function () use ($router) {
            $router->get('/perspectives', 'ScorecardController@indexPerspectives');
            $router->post('/perspectives', 'ScorecardController@storePerspective');
            $router->put('/perspectives/{id}', 'ScorecardController@updatePerspective');
            $router->delete('/perspectives/{id}', 'ScorecardController@destroyPerspective');
            $router->post('/perspectives/{id}/kpis', 'ScorecardController@attachKpi');
            $router->delete('/kpis/{id}', 'ScorecardController@detachKpi');
            $router->get('/compute', 'ScorecardController@compute');
        });

    });
});
