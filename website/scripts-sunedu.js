/* CONSULTA PUBLICA - VERIFICA SI ESTAS INSCRITO  */
	$('#buscar').click(function(event) {	
		$('#mensajefechamatricula').css('display', 'none');
		$.ajax({
			url: 'consulta',
			type: 'POST',
			dataType: 'json',
			data: $('#consultaForm').serialize(),
		})
		.done(function(data) {			
			$('#titulofinalData').html('');
			var trHTMLt = '';
			trHTMLt = '<tr class="table-success"><th>Graduado</th><th>Grado o Título</th><th>Institución</th><th style="display:none" class="cabSolicitar">Solicitar corrección</th></tr>';
			
			$('#titulofinalData').append(trHTMLt);
			$('#finalData').html('');
			$('#resultado_publica_box').removeClass('no-print');
			$('#docPriv,#codigoPriv').val('');
			$('.closeModalConstancia').addClass('hidden');	
			if (data.response == 'error'){
				$('#frmError').modal('toggle');
				$('#frmError_Body').html('<p>EL código CAPTCHA ingresado no es correcto.</p>')
			} else if (data == '[]'){
				var bitserviciosiu = 1;
				if (bitserviciosiu == 1) { // validamos que este activo el uso del servicio del siu -> config->app
					/*validamos si en el servicio de extranjeros hay registros*/
					$.ajax({
					url: 'consultaExt',
					type: 'POST',
					dataType: 'json',
					data: $('#consultaForm').serialize(),
					})
					.done(function(data) {
						if (data.length > 0  /*&& data[0].flgResolucionNulidad != 1*/) {
							$('#titulofinalData').html('');
							var trHTMLt = '';
							trHTMLt = '<tr class="table-success"><th>Graduado</th><th>Grado o Título</th><th>Institución</th><th style="display:none" class="cabSolicitar">Solicitar corrección</th></tr>';
							
							$('#titulofinalData').append(trHTMLt);
							$('#finalDataExt').html('');
							var trHTMLExt = '';	
							$.each(data, function(i, item) {
								trHTMLExt += '<tr>';
								trHTMLExt += '<td data-column="Graduado" style="font-size:12px; vertical-align:center;width: 25%;">'+ item.persona +'<br><strong>';
								trHTMLExt +=  item.tipoDocumentoIdentidad+' '+ item.numeroDocumento+'</strong></td>';
								trHTMLExt += '<td data-column="Grado o Título" style="font-size:12px; vertical-align:left; text-align:left;"><strong>'+ item.denominacionDiploma +'</strong><br>';
								trHTMLExt += '<b>Fecha de Diploma: '+item.fechaEmisionDiploma+'</b><br>';
								trHTMLExt += '<i>TIPO:<br>';
								if (item.idSolicitud == 26378 || item.idSolicitud == 30522 || item.idSolicitud == 304  || item.idSolicitud == 60764 || item.idSolicitud == 17366 || item.idSolicitud ==68477) {
                                    trHTMLExt += '<ul><li><b>RECONOCIMIENTO SOLO PARA EL EJERCICIO DE LA DOCENCIA UNIVERSITARIA E INVESTIGACIÓN</b></li></ul></i>';
                                }else if (item.idSolicitud == 68084) {
                                    trHTMLExt += '<ul><li><b>CERTIFICACIÓN</b></li></ul></i>';
                                }
                                else{
                                	trHTMLExt += '<ul><li><b>RECONOCIMIENTO</b></li></ul></i>';
                                }
								if (item.flgResolucionNulidad == 1) {
									var numresdatos = item.numeroResolucionNulidad;
									
									trHTMLExt += '<ul><li style="list-style: none; color: #FF0000;" ><b>REGISTRO ANULADO POR&nbsp' + numresdatos + '</b></li></ul>';
									trHTMLExt += '<ul><li style="list-style: none; color: #FF0000;" >Fecha de Resolución que declara Nulo el Registro:&nbsp' + item.fechaResolucionNulidad + '</li></ul>';
								}else if (item.idSolicitud == 68084) {
                                    trHTMLExt += '<ul><li style="list-style: none;" >Fecha de Resolución:&nbsp'+ item.fechaResolucion + '</li></ul>';
								}else{
									trHTMLExt += '<ul><li style="list-style: none;" >Fecha de Resolución de Reconocimiento:&nbsp'+ item.fechaResolucion + '</li></ul>';
								}
								if (item.flgResolucionLesividad == 1) {
								
								var numreslesividad = item.numeroResolucionLesividad;
								//var fechalesividad = item.fechaResolucionLesividad;																
								trHTMLExt += '<ul><li style="list-style: none; color: #FF0000;" >'+ numreslesividad+'</li>';
								trHTMLExt += '</ul>';
								}
								if ( item.numDiplReva != null) {
									if (item.numDiplReva.length > 0) {
									trHTMLExt += '<b>REVALIDADO</b> (<span id=grado'+item.idSolicitud+' name="grado"></span>) POR <span id=uni'+item.idSolicitud+' name="grado"></span>';
									trHTMLExt += '<br>Fecha de Resolución de Revalida: <span id=fecresolucion'+item.idSolicitud+' name="fecresolucion"></span>';
									trHTMLExt += '<br>Fecha de Expedición del Diploma: <span id=fecdiploma'+item.idSolicitud+' name="fecdiploma"></span><br>';
									dataRevaSiu(item.idSolicitud);
									}
									
								}
								/* modalidad y duración de estudio*/
								trHTMLExt += '<b>Modalidad de estudios: '+ item.modalidadEstudio+'<br>';
								trHTMLExt += 'Duración de estudios: '+ item.duracionEstudios+'</b>';
								trHTMLExt += '</td>';
								trHTMLExt += '<td data-column="Institución" style="font-size:12px; vertical-align:center;width: 32%;">';
								/* Lista de universidades y paises*/
								var datainstitucion = jQuery.parseJSON(item.entidades);
								$.each(datainstitucion, function(key, itemdata) 
								{
								   
								   trHTMLExt += itemdata.UNIVERSIDAD+'<br>';
								   trHTMLExt += '<b><i>'+itemdata.PAIS+'</i></b><br>';
								});								
								trHTMLExt += '</td>';
								trHTMLExt += '<td data-column="Accion" class="cabSolicitar" style="font-size:12px;text-align:center; vertical-align:center;display:none" ></td>';
								trHTMLExt += '</tr>';
							})
							$('#finalDataExt').append(trHTMLExt);	
							$('#resultado_publica_box').removeClass('hidden');
							$('#imprimir').attr('disabled',false);
							$('html,body').animate({scrollTop: $("#resultado_publica_box").offset().top},'slow');
						}else{
							
							$('#finalDataExt').html('');			
							$('#frmError').modal('toggle');
							$('#frmError_Body').html('<p>No se encontraron resultados.</p>');
						}
					})
					.fail(function() {
						$('#finalDataExt').html('');
					})
					.always(function() {				
					});	
				}else{
					$('#frmError').modal('toggle');
					$('#frmError_Body').html('<p>No se encontraron resultados.</p>');
				}				
				
			} else {
				var valor = 1;				
				var trHTML = '';					
				$.each($.parseJSON(data), function(i, item) {		
					/* DOCTORADO ESPECIAL */
					var uni='';	
					var c=0;
					$.each($.parseJSON(data), function(i, doc) {
						if (doc.BIT_DOC_ESP == "1" && doc.TIPO_GRADO == "D") {
							uni = '1.PONTIFICIA UNIVERSIDAD CATÓLICA DEL PERÚ<br>2.UNIVERSIDAD PERUANA CAYETANO HEREDIA<br>3.UNIVERSIDAD DEL PACÍFICO<br>4.UNIVERSIDAD DE LIMA';
						}else if(doc.BIT_DOC_ESP == "1" && doc.TIPO_GRADO == "B"){
							uni = '1.PONTIFICIA UNIVERSIDAD CATÓLICA DEL PERÚ<br>2.UNIVERSIDAD PERUANA CAYETANO HEREDIA';
						}
					});	 
					/*********************/	
					var valreval;					
					var TIPO_GRADO = item.TIPO_GRADO;
					var DIPL_TIP_EMI = item.DIPL_TIP_EMI;	
					if (item.RESO_NUM == item.UNI_RESO_NUM && item.BIT_DOC_ESP == "1"  && item.PAIS == 'PERU' ) {
						trHTML += '<tr>' + 
						'<td data-column="Graduado" style="font-size:12px; vertical-align:center">' + item.NOMBRE + '<br>';
						if (item.DOC_IDENT == '- X'){
							trHTML += '<small>Agradeceremos, comunicarse al correo, <span>actualizaciones@sunedu.gob.pe</span> especificando el asunto <span>"Alerta de página web"</span></small>'
						} else {
							trHTML += '<strong>' + item.DOC_IDENT +'</strong>';
						}
						trHTML += '</td>' +

						'<td data-column="Grado o Título" style="font-size:12px; vertical-align:left; text-align:left;">' + 
							item.TITULO_REV+'<br>';
							if(item.TIPO_INSCRI !='R'){
								var diplfecr = item.DIPL_FEC;
								if(diplfecr == null){
								diplfecr = '';							
								}
								trHTML += 'Fecha de diploma: '+diplfecr+'<br>';
								trHTML += 'Modalidad de estudios:&nbsp<span>' + item.MODALIDAD_ESTUDIO + '</span>' + '<br>';
							}
							var gradorev = item.GRADO_REV;
							if (gradorev != null){
								trHTML += item.GRADO_REV;
							}	
							if (item.FLG_RESOLUCION_NULIDAD == 1) {
								var numresdatos = item.NRO_RESOLUCION_NULIDAD;
								
								
								trHTML += '<ul><li style="list-style: none; color: #FF0000;" >REGISTRO ANULADO POR RESOLUCIÓN DIRECTORAL N°&nbsp' + numresdatos + '</li>';
								trHTML += '<li style="list-style: none; color: #FF0000;" >Fecha de Resolución que declara Nulo el Registro:&nbsp' + item.FECHA_RESOLUCION_NULIDAD + '</li></ul>';
							}
							if (item.FLG_RESOLUCION_LESIVIDAD == 1) {
								
								var numreslesividad = item.NRO_RESOLUCION_LESIVIDAD;
								var fechalesividad = item.FECHA_RESOLUCION_LESIVIDAD;																
								trHTML += '<ul><li style="list-style: none; color: #FF0000;" >SE HA DECLARADO LA LESIVIDAD DE LA INSCRIPCIÓN EN MÉRITO A LA '+ numreslesividad+' DEL '+ fechalesividad+'</li>';
								trHTML += '</ul>';
							}
							var DIPLOMA_FEC = item.DIPL_FEC;	
							if(DIPLOMA_FEC == null){
								DIPLOMA_FEC = 'No aplica';							
							}
							if(item.TIPO_INSCRI =='R'){
								trHTML += '<ul><li style="list-style: none;" >Fecha de Resolución de Revalida:&nbsp'+ item.RESO_FEC+'</li>';
								trHTML += '<li style="list-style: none;" >Fecha de Expedición del Diploma:&nbsp'+ DIPLOMA_FEC +'</li></ul>'
							}							
							if (item.PAIS == 'PARAGUAY'){
								trHTML += '<br><small>* Al sólo efecto de la prosecución de otros estudios de post grado y al sólo para el ejercicio de actividades académicas en Universidades de ambas Partes. Dicho reconocimiento no habilita para el ejercicio profesional</small>'
							}
							if (item.COMENTARIO != '-') {
								trHTML += '<br><br><small>' + item.COMENTARIO + '</small>';
							}							
					
						trHTML += '</td>' +
										'<td data-column="Institución" style="font-size:12px; vertical-align:center">' + uni;
						trHTML += '</br><b><i>' + item.PAIS + '</i></b>';
						trHTML += '</td>';
						trHTML += '<td data-column="Accion" class="btn-sm cabSolicitar" style="font-size:12px; vertical-align:center; text-align:center;display:none"><span style="cursor:pointer;color:#5d4595;" class="glyphicon glyphicon-edit  fa-2x" data-id="'+item.ID+'" data-opcion="PRI" data-proc="'+item.TIPO+'" id="btneditardata" data-toggle="tooltip" data-placement="top" title="Editar"></span></td>'
												
						trHTML += '</tr>';	
					}
					else if (item.TIPO_INSCRI == 'RE' && item.BIT_DOC_ESP != "1"  && item.PAIS == 'PERU'){	
					 var bitserviciosiu	 =1;
						if (bitserviciosiu === 0) { // validamos que este activo el uso del servicio de seegten -> config->app
							/* consulta publica extranjeros*/				
							 if(item.V_ORIGEN == 'SEEGTEN'){
							 	fecdiplomaSeegten(item.NUM_ORD_PAG,item.ID);
								
							 }else{
								
							 	fecdiplomaBdanr(item.ID_CERTIFICADO,item.ID);
							 } 
							trHTML += '<tr>' + 
							'<td data-column="Graduado" style="font-size:12px; vertical-align:center">' + item.NOMBRE + '<br>';
							if (item.DOC_IDENT == '- X'){
								trHTML += '<small>Agradeceremos, comunicarse al correo, <span>actualizaciones@sunedu.gob.pe</span> especificando el asunto <span>"Alerta de página web"</span></small>';
							} else {
								trHTML += '<strong>' + item.DOC_IDENT + '</strong>';
							}
							trHTML += '</td>' +
	 
							'<td data-column="Grado o Título" style="font-size:12px; vertical-align:left; text-align:left;">'+item.TITULO_REV+'<br>';
								if(item.V_ORIGEN == 'SEEGTEN'){								
									trHTML += 'Fecha Diploma:&nbsp<span id="fechaDiploma'+item.NUM_ORD_PAG+'">';
								}else{
									trHTML += 'Fecha Diploma:&nbsp<span id="fechaDiploma'+item.ID_CERTIFICADO+'">';
								}						
								
								trHTML += '</span><br>'+item.GRADO_REV;							
								if (item.FLG_RESOLUCION_NULIDAD == 1) {
									trHTML += '<ul><li style="list-style: none; color: #FF0000;" >Fecha de Resolución que declara Nulo el Registro:&nbsp' + item.FECHA_RESOLUCION_NULIDAD + '</li></ul>';
								}else{
									trHTML += '<ul><li style="list-style: none;" >Fecha de Resolución de Reconocimiento:&nbsp'+ item.RESO_FEC + '</li></ul>';
								}
								if (item.FLG_RESOLUCION_LESIVIDAD == 1) {
									
									var numreslesividad = item.NRO_RESOLUCION_LESIVIDAD;
									var fechalesividad = item.FECHA_RESOLUCION_LESIVIDAD;																
									trHTML += '<ul><li style="list-style: none; color: #FF0000;" >SE HA DECLARADO LA LESIVIDAD DE LA INSCRIPCIÓN EN MÉRITO A LA '+ numreslesividad+' DEL '+ fechalesividad+'</li>';
									trHTML += '</ul>';
								}

								if (item.PAIS == 'PARAGUAY' && item.ESSUNEDU == 1){
									trHTML += '<br><small>* Al sólo efecto de la prosecución de otros estudios de post grado y al sólo para el ejercicio de actividades académicas en Universidades de ambas Partes. Dicho reconocimiento no habilita para el ejercicio profesional</small>';
								}
								if (item.COMENTARIO != '-') {
									trHTML += '<br><br><small>' + item.COMENTARIO + '</small><br>';
									
								}							
								if(item.NUM_DIPL_REVA!= null){							
									revalida(item.NUM_DIPL_REVA,item.NUM_ORD_PAG);
										trHTML += '<ul><li><b>REVALIDADO</b> (<b><span id="titulo'+item.NUM_ORD_PAG+'"></span></b>) POR<br>';
										trHTML += '<b>"<span id="uni'+item.NUM_ORD_PAG+'"></span>"</b> <br>Fecha de Resolución de Revalida: <span id="fechaResolucion'+item.NUM_ORD_PAG+'"></span><br>';
										trHTML += 'Fecha de Expedición del Diploma:<span id="fechaExpDiplo'+item.NUM_ORD_PAG+'"></span></li></ul>';							
								}
								
								/*Modalidad estudio  - duracion*/	
							
	                            if(item.V_ORIGEN == 'SEEGTEN'){
	                                    trHTML += 'Modalidad de estudios:&nbsp<span id="spModEstudio'+item.NUM_ORD_PAG+'"></span><br/>';
	                                    trHTML += 'Duración de estudios:&nbsp<span id="spDuracion'+item.NUM_ORD_PAG+'"></span>';
	                            }else{
	                                    trHTML += 'Modalidad de estudios:&nbsp<span>' + item.MODALIDAD_ESTUDIO + '</span>';
	                            }
	                            /* Fecha de matricula y fecha de egreso*/
	                            if(item.TIPO_GRADO == 'B' || item.TIPO_GRADO == 'M'|| item.TIPO_GRADO == 'D' || item.TIPO_GRADO == 'S'){
	                            	var FECMATRI = '';
	                            	var FECEGRE = ''
	                            	if (item.MATRI_FEC === '-') { FECMATRI = 'Sin información (***)';
	                            		$('#mensajefechamatricula').css('display', 'block');
	                            	}else { FECMATRI = item.MATRI_FEC; }
	                            	if (item.EGRES_FEC === '-') { FECEGRE = 'Sin información (***)';
	                            		$('#mensajefechamatricula').css('display', 'block');
	                            	}else{ FECEGRE = item.EGRES_FEC;}
	                            	trHTML += '<br>Fecha matrícula:&nbsp<span>' + FECMATRI + '</span>';
	                            	trHTML += '<br>Fecha egreso:&nbsp<span>' + FECEGRE + '</span>';
	                            }
								
							trHTML += '</td>' +
											'<td data-column="Institución" style="font-size:12px; vertical-align:center">' + item.UNIV;
							trHTML += '</br><b><i>' + item.PAIS + '</i></b>';
							trHTML += '</td>';

								if(item.TIPO == 'N'){
								trHTML += '<td data-column="Accion" class="btn-sm cabSolicitar" style="font-size:12px; vertical-align:center; text-align:center;display:none"><span style="cursor:pointer;color:#5d4595;" class="glyphicon glyphicon-edit  fa-2x" data-id="'+item.ID+'" data-opcion="PRI" data-proc="'+item.TIPO+'" id="btneditardata" data-toggle="tooltip" data-placement="top" title="Editar"></span></td>';
								}else{									
									trHTML += '<td data-column="Accion" class="cabSolicitar" style="font-size:12px;text-align:center; vertical-align:center;display:none" ></td>';
									trHTML += '<td data-column="Accion" class="cabSolicitar" style="font-size:12px; vertical-align:center;display:none" ></td>';	
								}						
							trHTML += '</tr>';	
						}
						//consulta para extranjeros 
						if (bitserviciosiu == 1) { // validamos que este activo el uso del servicio del siu -> config->app							
							$.ajax({
								url: 'consultaExt',
								type: 'POST',
								dataType: 'json',
								data: $('#consultaForm').serialize(),
							})
							.done(function(data) {
								$('#finalDataExt').html('');
								var trHTMLExt = '';	
								$.each(data, function(i, item) {
									trHTMLExt += '<tr>';
									trHTMLExt += '<td data-column="Graduado" style="font-size:12px; vertical-align:center;width: 25%;">'+ item.persona +'<br><strong>';
									trHTMLExt +=  item.tipoDocumentoIdentidad+' '+ item.numeroDocumento+'</strong></td>';
									trHTMLExt += '<td data-column="Grado o Título" style="font-size:12px; vertical-align:left; text-align:left;"><strong>'+ item.denominacionDiploma +'</strong><br>Fecha de Diploma:'+item.fechaEmisionDiploma+'<br>';
									trHTMLExt += '<i>TIPO:<br>';
									if (item.idSolicitud == 26378 || item.idSolicitud == 30522 || item.idSolicitud == 304  || item.idSolicitud == 60764 || item.idSolicitud == 17366 || item.idSolicitud ==68477) {
                                        trHTMLExt += '<ul><li><b>RECONOCIMIENTO SOLO PARA EL EJERCICIO DE LA DOCENCIA UNIVERSITARIA E INVESTIGACIÓN</b></li></ul></i>';
                                    }else if (item.idSolicitud == 68084) {
                                        trHTMLExt += '<ul><li><b>CERTIFICACIÓN</b></li></ul></i>';
                                    }
                                    else{
                                    	trHTMLExt += '<ul><li><b>RECONOCIMIENTO</b></li></ul></i>';
                                    }
									
									if (item.flgResolucionNulidad == 1) {
										var numresdatos = item.numeroResolucionNulidad;										
										trHTMLExt += '<ul><li style="list-style: none; color: #FF0000;" ><b>REGISTRO ANULADO POR&nbsp' + numresdatos + '</b></li></ul>';
										trHTMLExt += '<ul><li style="list-style: none; color: #FF0000;" >Fecha de Resolución que declara Nulo el Registro:&nbsp' + item.fechaResolucionNulidad + '</li></ul>';
									}else if (item.idSolicitud == 68084) {
                                        trHTMLExt += '<ul><li style="list-style: none;" >Fecha de Resolución:&nbsp'+ item.fechaResolucion + '</li></ul>';
									}else{
										trHTMLExt += '<ul><li style="list-style: none;" >Fecha de Resolución de Reconocimiento:&nbsp'+ item.fechaResolucion + '</li></ul>';
									}
									if (item.flgResolucionLesividad == 1) {
								
										var numreslesividad = item.numeroResolucionLesividad;
										//var fechalesividad = item.fechaResolucionLesividad;															
										trHTMLExt += '<ul><li style="list-style: none; color: #FF0000;" >'+ numreslesividad+'</li>';
										trHTMLExt += '</ul>';
									}
									
									if ( item.numDiplReva != null) {
										if (item.numDiplReva.length > 0) {
										trHTMLExt += '<b>REVALIDADO</b> (<span id=grado'+item.idSolicitud+' name="grado"></span>) POR <span id=uni'+item.idSolicitud+' name="grado"></span>';
										trHTMLExt += '<br>Fecha de Resolución de Revalida: <span id=fecresolucion'+item.idSolicitud+' name="fecresolucion"></span>';
										trHTMLExt += '<br> Fecha de Expedición del Diploma: <span id=fecdiploma'+item.idSolicitud+' name="fecdiploma"></span><br>';
										dataRevaSiu(item.idSolicitud);
										}
										
									}
									/* modadlidad y duración de estudio*/
									trHTMLExt += 'Modalidad de estudios:  <strong>'+ item.modalidadEstudio+'</strong><br>';
									trHTMLExt += 'Duración de estudios: <strong>'+ item.duracionEstudios+'</strong>';
									trHTMLExt += '</td>';
									trHTMLExt += '<td data-column="Institución" style="font-size:12px; vertical-align:center;width: 32%;">'+ item.nombreEntidad+'<br><b><i>'+item.nombrePaisExtranjero+'</i></b></td>';									
									trHTMLExt += '<td data-column="Accion" class="cabSolicitar" style="font-size:12px;text-align:center; vertical-align:center;display:none" ></td>';
									trHTMLExt += '</tr>';
								})
								$('#finalDataExt').append(trHTMLExt);				
							})
							.fail(function() {				
								$('#finalDataExt').html('');
							})
							.always(function() {				
								//console.log("complete E2");
							});	
						}	
					}					
					else if(item.TIPO_INSCRI !='RE' && item.BIT_DOC_ESP != "1"  && item.PAIS == 'PERU'){	
						//if (item.TIPO_INSCRI != 'R') {			
						trHTML += '<tr>' + 
						'<td data-column="Graduado" style="font-size:12px; vertical-align:center">' + item.NOMBRE + '<br>';
						if (item.DOC_IDENT == '- X'){
							trHTML += '<small>Agradeceremos, comunicarse al correo, <span>actualizaciones@sunedu.gob.pe</span> especificando el asunto <span>"Alerta de página web"</span></small>'
						} else {
							trHTML += '<strong>' + item.DOC_IDENT +'</strong>';
						}
						trHTML += '</td>' +

						'<td data-column="Grado o Título" style="font-size:12px; vertical-align:left; text-align:left;">' + 

							item.TITULO_REV+'<br>';
							if(item.TIPO_INSCRI !='R'){
								var diplfecr = item.DIPL_FEC;
								if(diplfecr == null){
									diplfecr = '';							
								}
								trHTML += 'Fecha de diploma: '+diplfecr+'<br>';
								trHTML += 'Modalidad de estudios:&nbsp<span>' + item.MODALIDAD_ESTUDIO + '</span>' + '<br>';
							}
							var gradorev = item.GRADO_REV;
							if (gradorev != null){
								trHTML += item.GRADO_REV;
							}	
							if (item.FLG_RESOLUCION_NULIDAD == 1) {
								var numresdatos = item.NRO_RESOLUCION_NULIDAD;
								var numresdatos = numresdatos.slice(13);								
								
								trHTML += '<ul><li style="list-style: none; color: #FF0000;" ><b>REGISTRO ANULADO POR RESOLUCIÓN DIRECTORAL N° &nbsp' + numresdatos + '</li>';
								trHTML += '<li style="list-style: none; color: #FF0000;" >Fecha de Resolución que declara Nulo el Registro:&nbsp' + item.FECHA_RESOLUCION_NULIDAD + '</b></li></ul>';
							}
							if (item.FLG_RESOLUCION_LESIVIDAD == 1) {
								
								var numreslesividad = item.NRO_RESOLUCION_LESIVIDAD;
								var fechalesividad = item.FECHA_RESOLUCION_LESIVIDAD;																
								trHTML += '<ul><li style="list-style: none; color: #FF0000;" >SE HA DECLARADO LA LESIVIDAD DE LA INSCRIPCIÓN EN MÉRITO A LA '+ numreslesividad+' DEL '+ fechalesividad+'</li>';
								trHTML += '</ul>';
							}
							var DIPLOMA_FEC = item.DIPL_FEC;	
							if(DIPLOMA_FEC == null){
								DIPLOMA_FEC = 'No aplica';							
							}
							if(item.TIPO_INSCRI =='R'){
								trHTML += '<ul><li style="list-style: none;" >Fecha de Resolución de Revalida:&nbsp'+ item.RESO_FEC+'</li>';
								trHTML += '<li style="list-style: none;" >Fecha de Expedición del Diploma:&nbsp'+ DIPLOMA_FEC +'</li></ul>'
							}							
							if (item.PAIS == 'PARAGUAY'){
								trHTML += '<br><small>* Al sólo efecto de la prosecución de otros estudios de post grado y al sólo para el ejercicio de actividades académicas en Universidades de ambas Partes. Dicho reconocimiento no habilita para el ejercicio profesional</small>'
							}
	                           /* Fecha de matricula y fecha de egreso*/
	                            if(item.TIPO_GRADO == 'B' || item.TIPO_GRADO == 'M'|| item.TIPO_GRADO == 'D' || item.TIPO_GRADO == 'S'){
	                            	var FECMATRI = '';
	                            	var FECEGRE = ''
	                            	if (item.MATRI_FEC === '-') { FECMATRI = 'Sin información (***)';
	                            		$('#mensajefechamatricula').css('display', 'block');
	                            	}else { FECMATRI = item.MATRI_FEC; }
	                            	if (item.EGRES_FEC === '-') { FECEGRE = 'Sin información (***)';
	                            		$('#mensajefechamatricula').css('display', 'block');
	                            	}else{ FECEGRE = item.EGRES_FEC;}
	                            	trHTML += '<br>Fecha matrícula:&nbsp<span>' + FECMATRI + '</span>';
	                            	trHTML += '<br>Fecha egreso:&nbsp<span>' + FECEGRE + '</span>';
	                            }
							if (item.COMENTARIO != '-') {
								trHTML += '<br><br><small>' + item.COMENTARIO + '</small>';
							}
						trHTML += '</td>' +
						'<td data-column="Institución" style="font-size:12px; vertical-align:center">' + item.UNIV;
						trHTML += '</br><b><i>' + item.PAIS + '</i></b>';
						trHTML += '</td>';
						
							if(item.TIPO == 'N'){
							trHTML += '<td data-column="Accion" class="btn-sm cabSolicitar" style="font-size:12px; vertical-align:center; text-align:center;display:none"><span style="cursor:pointer;color:#5d4595;" class="glyphicon glyphicon-edit  fa-2x" data-id="'+item.ID+'" data-opcion="PRI" data-proc="'+item.TIPO+'" id="btneditardata" data-toggle="tooltip" data-placement="top" title="Editar"></span></td>'
							}else{
								trHTML += '<td data-column="Accion" class="cabSolicitar" style="font-size:12px; vertical-align:center;display:none" data-id="'+item.ID+'" data-opcion="PRI" data-proc="'+item.TIPO+'"></span></td>';	
							}						
						trHTML += '</tr>';
					//}
					}
						else if(item.TIPO_INSCRI !='RE' && item.TIPO_INSCRI !='O' && item.BIT_DOC_ESP != "1" && item.PAIS == 'PERU' ){
							 var bitserviciosiu	 =1;
							//consulta para extranjeros 
							if (bitserviciosiu == 1){ // validamos que este activo el uso del servicio del siu -> config->app
								$.ajax({
									url: 'consultaExt',
									type: 'POST',
									dataType: 'json',
									data: $('#consultaForm').serialize(),
								})
								.done(function(data) {
									$('#finalDataExt').html('');
									var trHTMLExt = '';	
									$.each(data, function(i, item) {
										trHTMLExt += '<tr>';
										trHTMLExt += '<td data-column="Graduado" style="font-size:12px; vertical-align:center;width: 25%;">'+ item.persona +'<br><strong>';
										trHTMLExt +=  item.tipoDocumentoIdentidad+' '+ item.numeroDocumento+'</strong></td>';
										trHTMLExt += '<td data-column="Grado o Título" style="font-size:12px; vertical-align:left; text-align:left;"><strong>'+ item.denominacionDiploma +'</strong><br>Fecha de Diploma:'+item.fechaEmisionDiploma+'<br>';
										trHTMLExt += '<i>TIPO:<br>';
										if (item.idSolicitud == 26378 || item.idSolicitud == 30522 || item.idSolicitud == 304  || item.idSolicitud == 60764 || item.idSolicitud == 17366 || item.idSolicitud ==68477) {
                                            trHTMLExt += '<ul><li><b>RECONOCIMIENTO SOLO PARA EL EJERCICIO DE LA DOCENCIA UNIVERSITARIA E INVESTIGACIÓN</b></li></ul></i>';
                                        }else if (item.idSolicitud == 68084) {
                                            trHTMLExt += '<ul><li><b>CERTIFICACIÓN</b></li></ul></i>';
                                        }
                                        else{
                                        	trHTMLExt += '<ul><li><b>RECONOCIMIENTO</b></li></ul></i>';                                            
                                        }
										if (item.flgResolucionNulidad == 1) {
											var numresdatos = item.numeroResolucionNulidad;
											
											trHTMLExt += '<ul><li style="list-style: none; color: #FF0000;" ><b>REGISTRO ANULADO POR&nbsp' + numresdatos + '</b></li></ul>';
											trHTMLExt += '<ul><li style="list-style: none; color: #FF0000;" >Fecha de Resolución que declara Nulo el Registro:&nbsp' + item.fechaResolucionNulidad + '</li></ul>';
										}else if(item.idSolicitud == 68084){
                                            trHTMLExt += '<ul><li style="list-style: none;" >Fecha de Resolución:&nbsp'+ item.fechaResolucion + '</li></ul>';
										}else{
											trHTMLExt += '<ul><li style="list-style: none;" >Fecha de Resolución de Reconocimiento:&nbsp'+ item.fechaResolucion + '</li></ul>';
										}
										
										if ( item.numDiplReva != null) {
											if (item.numDiplReva.length > 0) {
											trHTMLExt += '<b>REVALIDADO</b> (<span id=grado'+item.idSolicitud+' name="grado"></span>) POR <span id=uni'+item.idSolicitud+' name="grado"></span>';
											trHTMLExt += '<br>Fecha de Resolución de Revalida: <span id=fecresolucion'+item.idSolicitud+' name="fecresolucion"></span>';
											trHTMLExt += '<br>Fecha de Expedición del Diploma: <span id=fecdiploma'+item.idSolicitud+' name="fecdiploma"></span><br>';
											dataRevaSiu(item.idSolicitud);
											}
											
										}
										/* modadlidad y duración de estudio*/
										trHTMLExt += 'Modalidad de estudios: <strong>'+ item.modalidadEstudio+'</strong><br>';
										trHTMLExt += 'Duración de estudios:<strong>'+ item.duracionEstudios+'</strong>';
										trHTMLExt += '</td>';
										trHTMLExt += '<td data-column="Institución" style="font-size:12px; vertical-align:center;width: 32%;">'+ item.nombreEntidad+'<br><b><i>'+item.nombrePaisExtranjero+'</i></b></td>';
										
										trHTMLExt += '<td data-column="Accion" class="cabSolicitar" style="font-size:12px;text-align:center; vertical-align:center;display:none" ></td>';
										trHTMLExt += '</tr>';
									})
									$('#finalDataExt').append(trHTMLExt);				
								})
								.fail(function() {				
									$('#finalDataExt').html('');
								})
								.always(function() {				
									//console.log("complete E2");
								});	
							}
						}					

					$('.mensajes-especiales').removeClass('hidden');
				});
				
				var dataPublica =  $('#consultaForm').serialize();
				consultaPublicaSiu(dataPublica,valor);

				$('#finalData').append(trHTML);
				$('#resultado_publica_box').removeClass('hidden');
				$('#imprimir').attr('disabled',false);
				$('html,body').animate({scrollTop: $("#resultado_publica_box").offset().top},'slow');
			}
		})
		.fail(function() {
			mensaje();
			console.log("error");
		})
		.always(function() {
			refrescarC();
			$('.closeModalConstancia').removeClass('hidden');	
		});
		 		
	});