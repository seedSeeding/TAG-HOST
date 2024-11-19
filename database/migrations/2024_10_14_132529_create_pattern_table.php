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
       
       
        Schema::create('patterns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('maker_id')->constrained('users')->onDelete('cascade');
            $table->string('image')->nullable();
            $table->string('pattern_number')->unique();
            $table->string('name');
            $table->string("category");
            $table->string('brand');
            $table->string('outer_material');
            $table->string('lining_material');
           // $table->boolean('submitted')->default(false); 
            $table->timestamps();
        });

        

       
        Schema::create('sizes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'small', 'medium', 'large', 'X-large'
            $table->timestamps();
        });

    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop tables in reverse order to avoid foreign key constraint issues
        Schema::dropIfExists('pattern_parts');
        Schema::dropIfExists('sizes');
        Schema::dropIfExists('parts');
        Schema::dropIfExists('patterns');
        Schema::dropIfExists('categories');
    }
};
