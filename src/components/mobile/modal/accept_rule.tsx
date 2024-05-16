import React,{ Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import translate from '../../../function/languages'


//import '../../../css/App.css'

export default function Accept_rule(props) {
  const [open, setOpen] = useState(props.isopen)
  const [openNot, setOpenNot] = useState(false)

  //language
  const [lang] = useState<any>(translate(null))


  function setAgreeRule(){
    props.setAgree(true);
    setOpen(false);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpenNot}>
      <Transition.Child
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0" 
      >
        <div className="fixed inset-0 bg-gray-300 bg-opacity-[50%] transition-opacity" />
      </Transition.Child>


        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-end">
                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-24 sm:w-24">
                      <ExclamationTriangleIcon className="h-10 w-10 sm:h-18 sm:w-18 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 sm:ml-4 sm:mt-0">
                      <Dialog.Title className="text-center font-name-kanit sm:text-left text-xl sm:text-2xl font-semibold leading-6 text-red-700 underline">
                      {lang['rule_title']}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className=" text-gray-500 font-name-kanit text-[2vh] sm:text-sm  text-left">
                        {lang['rule_modal']}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full font-name-kanit justify-center rounded-md bg-green-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-[75%]"
                    onClick={() => setAgreeRule()}
                  >
                    ยอมรับข้อตกลง
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
