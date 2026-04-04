import myLogo from './assets/bb.png';

// Reusable Input Component to keep code clean
const InputField = ({ label, placeholder, type = "text" }: { label: string, placeholder: string, type?: string }) => (
  <div className="flex flex-col gap-2">
    <label className="font-semibold text-[16px] text-gray-800 ml-2">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full h-[52px] bg-[#f5f5f5] border border-gray-300 rounded-[20px] px-6 focus:outline-none focus:border-[#7ea33d] transition-all text-[14px]"
    />
  </div>
);

const DeliveryDetails = () => {
  return (
    <div className="bg-white min-h-screen relative font-['Inter']">
      {/* TOP GREEN HEADER BLOCK */}
      <div className="bg-[#7ea33d] h-[170px] w-full absolute top-0 left-0"></div>

      {/* NAVBAR */}
      <div className="relative z-10 pt-6 px-4">
        <nav className="max-w-[1120px] mx-auto bg-white rounded-full shadow-[0_6px_25px_rgba(0,0,0,0.08)] py-3 px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            
            {/* FIXED LINE BELOW: Changed src to use {myLogo} */}
            <img src={myLogo} alt="Logo" className="w-[80px] h-[80px] object-contain" />
            
            <div className="font-bold text-[16px] tracking-tight">
              GABAY <span className="text-[#7ea33d]">● HALAMAN</span>
            </div>
          </div>

          <div className="hidden md:flex gap-8 font-semibold text-[14px] text-gray-700">
            <span className="cursor-pointer hover:text-[#7ea33d]">Home</span>
            <span className="cursor-pointer hover:text-[#7ea33d]">Shop ▼</span>
            <span className="cursor-pointer hover:text-[#7ea33d]">More ▼</span>
          </div>

          <div className="flex gap-5 text-xl text-gray-700">
            <span className="cursor-pointer">🔍</span>
            <span className="cursor-pointer">🛒</span>
          </div>
        </nav>
      </div>

      {/* MAIN FORM CARD */}
      <main className="relative z-10 max-w-[700px] mx-auto mt-16 px-4 mb-20">
        <div className="bg-white rounded-[35px] p-10 shadow-[0_12px_30px_rgba(0,0,0,0.06)] border border-gray-50">
          
          <h1 className="font-['Playfair_Display'] text-[28px] font-bold text-center mb-10 text-gray-900">
            Delivery Details of the Customer
          </h1>

          <form className="space-y-6">
            <InputField label="Full Name" placeholder="Enter your name" />
            <InputField label="Email" placeholder="Enter your email" type="email" />
            <InputField label="Phone Number" placeholder="Enter your phone number" />
            <InputField label="Address" placeholder="Insert address for delivery" />

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[16px] text-gray-800 ml-2">Valid ID</label>
              <a href="#" className="text-blue-600 underline text-[14px] ml-2 hover:text-blue-800 transition-colors">
                Upload a file here
              </a>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-6">
              <button 
                type="button"
                className="flex-1 py-4 rounded-[22px] text-white bg-[#b94444] font-semibold shadow-md hover:brightness-95 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-4 rounded-[22px] text-white bg-[#7ea33d] font-semibold shadow-md hover:brightness-95 transition-all"
              >
                Save
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
};

export default DeliveryDetails;