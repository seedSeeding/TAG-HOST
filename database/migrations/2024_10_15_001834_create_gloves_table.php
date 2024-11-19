<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gloves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pattern_id')->constrained('patterns')->onDelete('cascade');
            $table->foreignId('size_id')->constrained()->onDelete('cascade'); 
            $table->json('palm_shell')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('black_shell')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('wrist')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('palm_thumb')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('back_thumb')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('index_finger')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('middle_finger')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('ring_finger')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
          
            $table->json('little_finger')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->string('approval_state')->default('pending'); 
            $table->timestamp('approval_time')->nullable(); 
            $table->timestamp('submit_date')->nullable();
            $table->boolean("submitted")->default(false);
            $table->boolean("saved")->default(false);
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gloves');
    }
};
