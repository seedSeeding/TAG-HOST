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
        Schema::create('glove_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('glove_id')->constrained('gloves')->onDelete('cascade');
            $table->foreignId('pattern_id')->constrained('patterns')->onDelete('cascade');
            $table->foreignId('size_id')->constrained()->onDelete('cascade');
            $table->json('palm_shell')->nullable();
            $table->json('black_shell')->nullable();
            $table->json('wrist')->nullable();
            $table->json('palm_thumb')->nullable();
            $table->json('back_thumb')->nullable();
            $table->json('index_finger')->nullable();
            $table->json('middle_finger')->nullable();
            $table->json('ring_finger')->nullable();
            $table->json('little_finger')->nullable();
            $table->string('approval_state')->nullable();
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
        Schema::dropIfExists('glove_histories');
    }
};
