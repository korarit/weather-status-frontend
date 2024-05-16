import React,{ Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

//import '../../../css/App.css'

export default function Voice_search(props) {
  const [open, setOpen] = useState(props.isopen)
  const [openNot, setOpenNot] = useState(false)

  const cancelButtonRef = useRef(null)

  const [voice_text, setVoice_text] = useState<string>('');
  function seacrhVoice(){
    //props.setAgree(true);
    setOpen(false);
  }

  return (
    <Transition.Root show={true} as='div'>
      <Dialog as="div" className="relative z-[100]" onClose={setOpenNot}>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel as="div" className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-end">
                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-24 sm:w-24">
                      <ExclamationTriangleIcon className="h-10 w-10 sm:h-18 sm:w-18 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 sm:ml-4 sm:mt-0">
                      <Dialog.Title className="text-center font-name-kanit text-xl sm:text-2xl font-semibold leading-6 text-red-700 underline">
                      ข้อตกลงการใช้งานเว็บไซต์
                      </Dialog.Title>
                      <div className="mt-2">
                        <button
                            type="button"
                            className="inline-flex w-full font-name-kanit justify-center rounded-md bg-green-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-500 "
                            
                        >
                            ค้นหา
                        </button>
                        <p className=" text-gray-500 font-name-kanit text-sm sm:text-sm  text-center ">
                        
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full font-name-kanit justify-center rounded-md bg-green-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-500 "
                    onClick={() => seacrhVoice()}
                  >
                    ค้นหา
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    
  )
}
