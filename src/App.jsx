import React, { useState } from "react";

function App() {
  return (
    <div className="contenedorPrincipal">
      <h1 className="tituloPrincipal">Liquidaciones de pines</h1>
      <FormularioLiquidacion />
    </div>
  );
}

function FormularioLiquidacion() {
  // Estado para manejar el paso actual del formulario
  const [paso, setPaso] = useState(1);

  // Estado para los datos principales, paso 1
  const [datos, setDatos] = useState({
    placa: "",
    placaConfirmacion: "",
    modelo: "2025",
    tipoCarro: "Particular",
    tipoServicio: "A1",
    formaPago: "Contado",
  });

  // Estado para la información del cliente, paso 2
  const [formData, setFormData] = useState({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  // Estado para el método de pago elegido, paso 3
  const [metodoPago, setMetodoPago] = useState("");

  // Controla si se muestra la ventana de confirmación o no
  const [showConfirm, setShowConfirm] = useState(false);

  // Avanzar al siguiente paso
  const avanzar = () => setPaso((p) => p + 1);

  const retroceder = () => {
    setShowConfirm(true);
  };

  // Resetea el formulario completo
  const resetearFormulario = () => {
    setPaso(1);
    setDatos({
      placa: "",
      placaConfirmacion: "",
      modelo: "2025",
      tipoCarro: "Particular",
      tipoServicio: "A1",
      formaPago: "",
    });
    setFormData({
      tipoDocumento: "",
      numeroDocumento: "",
      nombre: "",
      apellidos: "",
      direccion: "",
      telefono: "",
      correo: "",
    });
    setMetodoPago("");
    setMensaje("");
    setShowConfirm(false);
  };

  // Genera liquidación y resetea todo
  const generarLiquidacion = () => {
    alert("✅ Liquidación generada");
    resetearFormulario();
  };

  return (
    <div className="form-container">
      {/* Paso 1 */}
      <div className={`step-container ${paso >= 1 ? "active" : ""}`}>
        <div className="step-header">
          <span className="step-number">1</span>
          <h2 className="step-title">Información general</h2>
        </div>
        <div className="step-content">
          <Paso1 datos={datos} setDatos={setDatos} avanzar={avanzar} />
        </div>
      </div>

      <div className="step-line1"></div>

      {/* Paso 2 */}
      <div
        className={`step-container ${paso >= 2 ? "active" : ""} ${
          paso > 1 ? "completed" : ""
        }`}>
        <div className="step-header" onClick={() => paso > 1 && setPaso(2)}>
          <span className="step-number">2</span>
          <h2 className="step-title">Liquidación</h2>
        </div>
        <div className="step-content">
          <Liquidacion 
            formData={formData} 
            setFormData={setFormData} 
            retroceder={retroceder} 
            avanzar={avanzar} 
          />
        </div>
      </div>

      {paso === 2 && <div className="step-line2"></div>}

      {/* Paso 3 */}
      <div
        className={`step-container ${paso === 3 ? "active" : ""} ${
          paso > 2 ? "completed" : ""
        }`}>
        <div className="step-header" onClick={() => paso > 2 && setPaso(3)}>
          <span className="step-number">3</span>
          <h2 className="step-title">Pago</h2>
        </div>
        <div className="step-content">
          <Paso3 
            metodoPago={metodoPago} 
            setMetodoPago={setMetodoPago} 
            retroceder={retroceder}
          />        
        </div>
      </div>

      <div className="button-group-full">
        <button onClick={retroceder} className="button-back">
          Cancelar
        </button>
        <button 
          onClick={generarLiquidacion} 
          className="button-generar"
          disabled={metodoPago === ""}>
          GENERAR
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">!</div>
            <h2>Estás seguro?</h2>
            <p>Se perderá la información registrada</p>
            <div className="modal-buttons">
              <button 
                className="button-si-cancelar"
                onClick={resetearFormulario}>
                Sí, cancelar
              </button>
              <button 
                className="button-no-continuar"
                onClick={() => setShowConfirm(false)}>
                No, continuar con el formulario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Paso 1: Información principal
function Paso1({ datos, setDatos, avanzar }) {
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Validación de placa antes de avanzar
  const handleConsultar = () => {
    // Verifica que la confirmación coincida
    if (datos.placa.toUpperCase() !== datos.placaConfirmacion.toUpperCase()) {
      setError("Las placas no coinciden");
      return;
    }

    const placaMayusculas = datos.placa.toUpperCase();

    // Valida formatos de  placa de carro y moto
    const regexCarro = /^[A-Z]{3}\d{3}$/;
    const regexMoto = /^[A-Z]{3}\d{2}[A-Z]$/;

    const esPlacaValidaCarro = regexCarro.test(placaMayusculas);
    const esPlacaValidaMoto = regexMoto.test(placaMayusculas);

    if (!esPlacaValidaCarro && !esPlacaValidaMoto) {
      setError("Formato inválido. Carro: ABC123, Moto: ABC12D");
      return;
    }

    setError("");
    avanzar();
  };

  // Validar si los campos obligatorios están completos
  const camposCompletos =
    datos.placa.trim() !== "" &&
    datos.placaConfirmacion.trim() !== "" &&
    datos.modelo.trim() !== "" &&
    datos.tipoCarro.trim() !== "" &&
    datos.tipoServicio.trim() !== "" &&
    datos.formaPago.trim() !== "";

  return (
    <div className="card">
      <div className="input-group">
        <div className="input-field-container">
          <div className="floating-label-group">
            <input
              name="placa"
              value={datos.placa}
              onChange={manejarCambio}
              placeholder=" "
              className="input-placa"
            />
            <label className="floating-label">Placa</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <input
              name="placaConfirmacion"
              value={datos.placaConfirmacion}
              onChange={manejarCambio}
              placeholder=" "
              className="input-placaC"
            />
            <label className="floating-labelC">Confirmación de placa</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <select
              name="modelo"
              value={datos.modelo}
              onChange={manejarCambio}
              className="select-modelo"
            >
              <option value="" disabled hidden></option>
              <option value="2025">Modelo 2025</option>
              <option value="2024">Modelo 2024</option>
              <option value="2023">Modelo 2023</option>
              <option value="2022">Modelo 2022</option>
            </select>
            <label className="floating-labelM">Modelo</label>
          </div>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="input-group-row">
        <div className="input-field-container">
          <div className="floating-label-group">
            <select
              name="tipoCarro"
              value={datos.tipoCarro}
              onChange={manejarCambio}
              className="selectCarro"
            >
              <option value="" disabled hidden></option>
              <option value="Particular">Particular</option>
              <option value="Servicio Público">Servicio Público</option>
            </select>
            <label className="floating-labelTC">Tipo de carro</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <select
              name="tipoServicio"
              value={datos.tipoServicio}
              onChange={manejarCambio}
              className="selectServicio"
            >
              <option value="" disabled hidden></option>
              <option value="A1">A1</option>
              <option value="B1">B1</option>
              <option value="C1">C1</option>
            </select>
            <label className="floating-labelS">Tipo de servicio</label>
          </div>
        </div>
      </div>

      <div className="pago-group">
        <label>Forma de pago</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="formaPago"
              value="Contado"
              checked={datos.formaPago === "Contado"}
              onChange={manejarCambio}
            />
            Contado
          </label>
          <label>
            <input
              type="radio"
              name="formaPago"
              value="TioPaco"
              checked={datos.formaPago === "TioPaco"}
              onChange={manejarCambio}
            />
            Tío Paco
          </label>
        </div>
      </div>

      <div className="button-group">
        <button 
          onClick={handleConsultar} 
          className="button-consultar"
          disabled={!camposCompletos}>
          CONSULTAR
        </button>
      </div>
    </div>
  );
}

// Paso 2: Liquidación
function Liquidacion({ retroceder, avanzar, formData, setFormData }) {
  const [valores] = useState({
    ansv: 7000,
    recaudo: 10591,
    sicov: 99936,
    runt: 15900,
    servicio: 221943,
    iva: 42169.17,
  });

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Valida que todos los campos estén completos
  const camposCompletos =
    formData.tipoDocumento.trim() !== "" &&
    formData.numeroDocumento.trim() !== "" &&
    formData.nombre.trim() !== "" &&
    formData.apellidos.trim() !== "" &&
    formData.direccion.trim() !== "" &&
    formData.telefono.trim() !== "" &&
    formData.correo.trim() !== "";

  // Total de la liquidación
  const calcularTotal = () => {
    return (
      valores.ansv +
      valores.recaudo +
      valores.sicov +
      valores.runt +
      valores.servicio +
      valores.iva
    );
  };

  return (
    <div className="card">
      <form>
        <label className="infoC">Información del Cliente</label>
        <div className="input-field-container">
          <div className="floating-label-group">
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="inputLiq"
            >
              <option value="" disabled hidden></option>
              <option value="cc">Cédula de ciudadanía</option>
              <option value="ce">Cédula de extranjería</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="licencia">Licencia de Conducción</option>
            </select>
            <label className="floating-labelDoc">Tipo de Documento</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <input
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              className="inputLiq"
              placeholder=""
            />
            <label className="floating-labelNum">Número de Documento</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="inputLiq"
              placeholder=""
            />
            <label className="floating-labelNombre">Nombre</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className="inputLiq"
              placeholder=""
            />
            <label className="floating-labelApe">Apellidos</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <input
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="inputLiq"
              placeholder=""
            />
            <label className="floating-labelDir">Dirección</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="inputLiq"
              placeholder=""
            />
            <label className="floating-labelTel">Teléfono</label>
          </div>
        </div>

        <div className="input-field-container">
          <div className="floating-label-group">
            <input
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="inputLiq"
              placeholder=""
            />
            <label className="floating-labelCor">Correo Electrónico</label>
          </div>
        </div>
      </form>

      <div className="liquidacion">
        <div className="resumen-title">Valor de liquidación</div>
        <div className="resumen">
          <p><span>ANSV:</span> ${valores.ansv}</p>
          <p><span>Recaudo:</span> ${valores.recaudo}</p>
          <p><span>SICOV:</span> ${valores.sicov}</p>
          <p><span>RUNT:</span> ${valores.runt}</p>
          <p><span>Valor servicio:</span> ${valores.servicio}</p>
          <p><span>IVA servicio:</span> ${valores.iva}</p>
          <div className="total-container">
            <h4 className="total-title">
              <span>Total:</span>
              <span>${calcularTotal()}</span>
            </h4>
          </div>
        </div>
      </div>

      <div className="button-group-full">
        <button 
          onClick={avanzar} 
          className="button-continue" 
          disabled={!camposCompletos}>
          Continuar
        </button>
      </div>
    </div>
  );
}

// Paso 3: Método de pago
function Paso3({ retroceder, metodoPago, setMetodoPago }) {
  const [mensaje, setMensaje] = useState("");

  // Mensaje si no hay método de pago
  const generarLiquidacion = () => {
    if (metodoPago === "") {
      setMensaje("⚠️ Por favor selecciona un método de pago.");
    } else {
      setMensaje("✅ Liquidación generada");
    }
  };


  return (
    <div className="card">
      <div className="pago-group">
        <div className="cards-pago-container">
          <div 
            className={`pago-card ${metodoPago === "efectivo" ? "selected" : ""}`}
            onClick={() => setMetodoPago("efectivo")}>
            <span className="pago-icon"><i className="fas fa-money-bill-wave"></i></span>
            <span>Efectivo</span>
            {metodoPago === "efectivo" && <span className="checkmark"></span>}
          </div>

          <div 
            className={`pago-card ${metodoPago === "pse" ? "selected" : ""}`}
            onClick={() => setMetodoPago("pse")}>
            <span className="pago-icon"><i className="fas fa-dollar-sign"></i></span>
            <span>PSE</span>
            {metodoPago === "pse" && <span className="checkmark"></span>}
          </div>

          <div 
            className={`pago-card ${metodoPago === "corresponsal" ? "selected" : ""}`}
            onClick={() => setMetodoPago("corresponsal")}>
            <span className="pago-icon"><i className="fas fa-university"></i></span>
            <span>Corresponsal bancario</span>
            {metodoPago === "corresponsal" && <span className="checkmark"></span>}
          </div>

          <div 
            className={`pago-card ${metodoPago === "datafono" ? "selected" : ""}`}
            onClick={() => setMetodoPago("datafono")}>
            <span className="pago-icon"><i className="fas fa-credit-card"></i></span>
            <span>Datáfono</span>
            {metodoPago === "datafono" && <span className="checkmark"></span>}
          </div>
        </div>
      </div>

      {mensaje && (
        <p className={`message-status ${mensaje.startsWith("⚠️") ? "error-message" : "success-message"}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
export default App;