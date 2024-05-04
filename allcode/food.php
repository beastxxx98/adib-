<?php 
   include("db.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <title>Document</title>
    <style>
        .result {
            color: red;
        }

        td {
            text-align: center;
        }
    </style>
</head>
<body>
    <section class="mt-3">
        <div class="container-fluid">
            <h4 class="text-center" style="color: green;">Adding Food</h4>
            <h6 class="text-center">FitTracker360</h6>
            <div class="row">
                <div class="col-md-5 mt-4">
                    <table class="table" style="background-color: #f5f5f5;">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Food Name</th>
                                
                                <th style="width: 31%">Qty</th>
                                <th>Calorie Contain </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td scope="row">1</td>
                                <td style="width: 60%;">
                                    <select name="vegitable" id="vegitable" class="form-control">
                                        <?php 
                                            $sql = "SELECT * FROM food";
                                            $query = mysqli_query($conn, $sql);
                                            while($row = mysqli_fetch_assoc($query)) {
                                                echo '<option id="'.$row['FoodId'].'" value="'.$row['FoodName'].'" class="vegitable custom-select">'.$row['Calorie'].'</option>';
                                            }
                                        ?>   
                                    </select>
                                </td>
                                <td style="width: 1%">
                                    <input type="number" id="qty" min="0" value="0" class="form-control">
                                </td>
                                <td>
                                    <p> id="calorie"></p>
                                </td>
                                <td><button id="add" class="btn btn-primary">Add</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <div role="alert" id="errorMsg" class="mt-5"></div>
                </div>

                <div class="col-md-7 mt-4" style="background-color: #f5f5f5;">
                    <div class="p-4">
                        <div class="text-center">
                            <h4>You Intake Calorie Count</h4>
                        </div>
                        <span class="mt-4">Time: <span id="time"></span></span>
                        <div class="row">
                            <div class="col-xs-6 col-sm-6 col-md-6">
                                <span id="day"></span>: <span id="year"></span>
                            </div>
                            <div class="col-xs-6 col-sm-6 col-md-6 text-right">
                                <p>Total Calorie:</p>
                            </div>
                        </div>
                        <div class="row">
                            <table id="receipt_bill" class="table">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Food Name</th>
                                        <th>Quantity</th>
                                        <th class="text-center">Calorie</th>
                                        <th class="text-center">Total cal</th>
                                    </tr>
                                </thead>
                                <tbody id="new"></tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="text-right text-dark">
                                        <h5><strong>Sub Total: cal</strong></h5>
                                    </td>
                                    <td class="text-center text-dark">
                                        <h5><strong><span id="subTotal"></span></strong></h5>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="text-right text-dark">
                                        <h5><strong>Total calorie: cal</strong></h5>
                                    </td>
                                    <td class="text-center text-danger">
                                        <h5 id="total calorie"><strong></strong></h5>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</body>
</html>

<script>
    $(document).ready(function() {
        $('#vegitable').change(function() {
            var id = $(this).find(':selected')[0].id;
            $.ajax({
                method: 'POST',
                url: 'fetch.php',
                data: { id: id },
                dataType: 'json',
                success: function(data) {
                    $('#vegitable').text(data.FoodName);
                }
            });
        });

        var count = 1;
        $('#add').on('click', function() {
            var name = $('#vegitable').val();
            var qty = $('#qty').val();
            var price = $('#calorie').text();

            if (qty == 0) {
                var erroMsg = '<span class="alert alert-danger ml-5">Minimum Qty should be 1 or More than 1</span>';
                $('#errorMsg').html(erroMsg).fadeOut(9000);
            } else {
                billFunction();
            }

            function billFunction() {
                var total = 0;

                $("#receipt_bill").each(function() {
                    var total = price * qty;
                    var subTotal = 0;
                    subTotal += parseInt(total);

                    var table = '<tr><td>' + count + '</td><td>' + name + '</td><td>' + qty + '</td><td>' + price + '</td><td><strong><input type="hidden" id="total" value="' + total + '">' + total + '</strong></td></tr>';
                    $('#new').append(table)

                    var total = 0;
                    $('tbody tr td:last-child').each(function() {
                        var value = parseInt($('#total', this).val());
                        if (!isNaN(value)) {
                            total += value;
                        }
                    });
                    $('#subTotal').text(total);

                    var Subtotal = $('#subTotal').text();
                    

                    var totalPayment = parseFloat(Subtotal) + parseFloat(taxAmount);
                    $('#totalPayment').text(totalPayment.toFixed(2)); // Showing using ID 
                });
                count++;
            }
        });

        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/" +
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getFullYear();
        $('#year').text(datetime);

        function myFunction() {
            var d = new Date();
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";

            var day = weekday[d.getDay()];
            return day;
        }
        var day = myFunction();
        $('#day').text(day);
    });
</script>

<script>
    window.onload = displayClock();

    function displayClock() {
        var time = new Date().toLocaleTimeString();
        document.getElementById("time").innerHTML = time;
        setTimeout(displayClock, 1000);
    }
</script>
