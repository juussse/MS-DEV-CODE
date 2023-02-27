			let f = new Date();	
			let d=f.getDate();//dia
			let m=f.getMonth();//mes
			let y=f.getFullYear();//año
			
			
			
			let restante=12;
			let diasa=0;
			let citas="";

			while(restante>=0)
			{
				if(restante>=7 && restante<=12)
				{
					diasa=28;
					restante--;
					citas+=+d+"/"+(m+1)+"/"+y+"<br>";
				}
				else if(restante==5 || restante==6)
				{
					diasa=14;
					restante--;
					citas+=+d+"/"+(m+1)+"/"+y+"<br>";
				}
				else
				{
					diasa=7;
					restante--;
					citas+=+d+"/"+(m+1)+"/"+y+"<br>";
				}
				//febrero
				if(m===1)
				{

					let año="", año1="", año2="", años="";
					let auxiliar1=y.toString();
					let auxiliar2=auxiliar1.split('');
					let auxiliar3=auxiliar2[0];
					for (let i = 0; i <= 100; i+=4) 
					{

						if(i<=8)
						{

							año=auxiliar3+"00"+i.toString();
							if(y.toString()===año)
							{
								d=d+diasa;
								if(d>29)
								{
									m+=1;
									d-=29;
								}
							}
							else
							{

							}
						}
						else if(i<=96)
						{

							año1=auxiliar3+"0"+i.toString();
							if(y.toString()===año1)
							{
								d=d+diasa;
								if(d>29)
								{
									m+=1;
									d-=29;
								}
							}
						}
						else if(i==100)
						{

							año2=auxiliar3+i.toString();
							if(y.toString()===año2)
							{
								d=d+diasa;
								if(d>29)
								{
									m+=1;
									d-=29;
								}
							}
							else
							{
								
								d=d+diasa;
								if(d>28)
								{
									m+=1;
									d-=28;
								}
							}
						}
					}
				}

				//meses con 31 dias excepto diciembre
				// enero    marzo    mayo     julio   agosto  octubre

				else if(m===0 || m===2 || m===4 || m===6 || m===7 || m===9) 
				{

					d=d+diasa;
					if(d>31)
					{
						m+=1;
						d-=31;
					}
				}

				//meses con 30 dias
				// abril    junio  septiembre noviembre
				else if(m===3 || m===5 || m===8 || m===10)
				{

					d=d+diasa;
					if(d>30)
					{
						m+=1;
						d-=30;
					}
					
				}

				//diciembre
				else if(m===11)
				{

					d=d+diasa;
					if(d>31)
					{
						m=0;
						d-=31;
						y++;
					}
				}
				
				//document.getElementById("demo1").innerHTML=citas;
				let fechas=citas.split("<br>");
				document.getElementById("fecha1").innerHTML=fechas[0];
				document.getElementById("fecha2").innerHTML=fechas[1];
				document.getElementById("fecha3").innerHTML=fechas[2];
				document.getElementById("fecha4").innerHTML=fechas[3];
				document.getElementById("fecha5").innerHTML=fechas[4];
				document.getElementById("fecha6").innerHTML=fechas[5];
				document.getElementById("fecha7").innerHTML=fechas[6];
				document.getElementById("fecha8").innerHTML=fechas[7];
				document.getElementById("fecha9").innerHTML=fechas[8];
				document.getElementById("fecha10").innerHTML=fechas[9];
				document.getElementById("fecha11").innerHTML=fechas[10];
				document.getElementById("fecha12").innerHTML=fechas[11];
				document.getElementById("fecha13").innerHTML=fechas[12];
			}